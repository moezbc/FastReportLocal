import logging
from celery import shared_task
from django.utils import timezone
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def run_report_task(self, execution_id):
    """Execute a report and route the output."""
    from reports.models import ReportExecution
    from .services import execute_report_query, export_results

    try:
        execution = ReportExecution.objects.select_related('report').get(id=execution_id)
        execution.status = 'running'
        execution.save(update_fields=['status'])

        report = execution.report

        # Execute query
        columns, rows = execute_report_query(report, execution.parameters)

        if not rows:
            execution.status = 'success'
            execution.error_message = 'Aucun enregistrement trouvé. Génération et routage ignorés.'
            execution.completed_at = timezone.now()
            execution.save(update_fields=['status', 'error_message', 'completed_at'])
            logger.info(f"Report execution {execution_id} returned 0 rows. Skipping generation and routing.")
            return {'status': 'success', 'execution_id': execution_id, 'message': 'empty'}

        # Export results
        content, content_type, extension = export_results(
            columns, rows,
            execution.output_type,
            report.csv_separator
        )

        # Save result file
        filename = f"{report.name}_{execution.started_at.strftime('%Y%m%d_%H%M%S')}.{extension}"
        execution.result_file.save(filename, ContentFile(content), save=False)

        # Route output
        if execution.routing_mode != 'screen':
            route_output(execution.id, execution.routing_mode, execution.routing_config, content, filename, content_type)

        execution.status = 'success'
        execution.completed_at = timezone.now()
        execution.save(update_fields=['status', 'completed_at', 'result_file'])

        logger.info(f"Report execution {execution_id} completed successfully.")
        return {'status': 'success', 'execution_id': execution_id}

    except Exception as exc:
        logger.error(f"Report execution {execution_id} failed: {exc}")
        try:
            execution = ReportExecution.objects.get(id=execution_id)
            execution.status = 'failed'
            execution.error_message = str(exc)
            execution.completed_at = timezone.now()
            execution.save(update_fields=['status', 'error_message', 'completed_at'])
        except ReportExecution.DoesNotExist:
            pass
        raise self.retry(exc=exc, countdown=60)


@shared_task
def run_scheduled_report(schedule_id):
    """Execute a scheduled report."""
    from reports.models import ReportSchedule, ReportExecution

    try:
        schedule = ReportSchedule.objects.select_related('report', 'user').get(id=schedule_id)
        if not schedule.is_active:
            logger.info(f"Schedule {schedule_id} is inactive, skipping.")
            return

        # Create an execution entry
        execution = ReportExecution.objects.create(
            report=schedule.report,
            user=schedule.user,
            parameters=schedule.parameters,
            output_type=schedule.output_type,
            routing_mode=schedule.routing_mode,
            routing_config=schedule.routing_config,
            status='pending',
        )

        # Run the report
        run_report_task.delay(execution.id)

        # If one-time schedule, deactivate it
        if schedule.schedule_type == 'once':
            schedule.is_active = False
            schedule.save(update_fields=['is_active'])

        logger.info(f"Scheduled report {schedule_id} triggered, execution {execution.id} created.")

    except ReportSchedule.DoesNotExist:
        logger.error(f"Schedule {schedule_id} not found.")
    except Exception as exc:
        logger.error(f"Scheduled report {schedule_id} failed: {exc}")


def route_output(execution_id, routing_mode, routing_config, content, filename, content_type):
    """Route the report output to the configured destination."""
    if routing_mode == 'email':
        from reports.models import ReportExecution
        execution = ReportExecution.objects.select_related('report').get(id=execution_id)
        default_body = execution.report.email_body or 'Veuillez trouver le rapport en pièce jointe.'
        _route_email(routing_config, content, filename, content_type, default_body, execution_id)
    elif routing_mode == 'sftp':
        _route_sftp(routing_config, content, filename)
    elif routing_mode == 'ftp':
        _route_ftp(routing_config, content, filename)
    elif routing_mode == 'local':
        _route_local(routing_config, content, filename)
    # 'screen' mode doesn't need routing – file is already saved


def _route_email(config, content, filename, content_type, default_body='Veuillez trouver le rapport en pièce jointe.', execution_id=None):
    """Send report via email using stored SmtpConfig."""
    from django.core.mail import EmailMessage
    from django.core.mail.backends.smtp import EmailBackend
    from django.conf import settings
    from django.core.signing import Signer
    from settings_app.models import SmtpConfig

    recipients = config.get('recipients', [])
    if not recipients:
        raise ValueError("Email routing: aucun destinataire configuré.")

    # Get SMTP config: use specified ID or default
    smtp_id = config.get('smtp_config_id')
    if smtp_id:
        smtp = SmtpConfig.objects.get(pk=smtp_id)
    else:
        smtp = SmtpConfig.objects.filter(is_default=True).first()
        if not smtp:
            smtp = SmtpConfig.objects.first()
    if not smtp:
        raise ValueError("Aucune configuration SMTP trouvée.")

    if not smtp.password:
        raise ValueError(f"Configuration SMTP '{smtp.name}': mot de passe manquant.")

    # Create custom backend with stored SMTP credentials
    backend = EmailBackend(
        host=smtp.host,
        port=smtp.port,
        username=smtp.username,
        password=smtp.password,
        use_tls=smtp.use_tls,
        fail_silently=False,
    )

    subject = config.get('subject', f'Rapport: {filename}')
    body = config.get('body') or default_body

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=smtp.from_email,
        to=recipients,
        connection=backend,
    )

    if len(content) > settings.MAX_EMAIL_ATTACHMENT_SIZE and execution_id:
        signer = Signer()
        token = signer.sign(str(execution_id))
        download_url = f"{settings.BACKEND_URL.rstrip('/')}/api/report-launcher/executions/{execution_id}/download/?token={token}"
        
        email.body += f"\n\nLe fichier généré est trop volumineux pour être mis en pièce jointe ({(len(content) / (1024 * 1024)):.2f} Mo)."
        email.body += f"\nVous pouvez le télécharger via ce lien : {download_url}"
    else:
        email.attach(filename, content, content_type)

    email.send()
    logger.info(f"Report emailed to {recipients} via SMTP '{smtp.name}'")


def _route_sftp(config, content, filename):
    """Upload report via SFTP."""
    import paramiko

    host = config.get('host', '')
    port = config.get('port', 22)
    username = config.get('username', '')
    password = config.get('password', '')
    remote_path = config.get('remote_path', '/')

    transport = paramiko.Transport((host, port))
    transport.connect(username=username, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)

    import io
    with sftp.open(f"{remote_path}/{filename}", 'wb') as f:
        f.write(content)

    sftp.close()
    transport.close()
    logger.info(f"Report uploaded via SFTP to {host}:{remote_path}/{filename}")


def _route_ftp(config, content, filename):
    """Upload report via FTP."""
    import ftplib
    import io

    host = config.get('host', '')
    port = config.get('port', 21)
    username = config.get('username', 'anonymous')
    password = config.get('password', '')
    remote_path = config.get('remote_path', '/')

    ftp = ftplib.FTP()
    ftp.connect(host, port)
    ftp.login(username, password)
    ftp.cwd(remote_path)
    ftp.storbinary(f'STOR {filename}', io.BytesIO(content))
    ftp.quit()
    logger.info(f"Report uploaded via FTP to {host}:{remote_path}/{filename}")


def _route_local(config, content, filename):
    """Save report to local filesystem."""
    import os
    local_path = config.get('path', '/app/media/report_results/')
    os.makedirs(local_path, exist_ok=True)
    filepath = os.path.join(local_path, filename)
    with open(filepath, 'wb') as f:
        f.write(content)
    logger.info(f"Report saved locally to {filepath}")
