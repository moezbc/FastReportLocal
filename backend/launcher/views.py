import json
import logging

from django.http import HttpResponse
from django.utils import timezone as tz
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from reports.models import Report, ReportExecution, ReportSchedule
from reports.permissions import get_executable_reports_queryset, can_execute_report
from reports.serializers import ReportExecutionSerializer, ReportScheduleSerializer
from django.core.signing import Signer, BadSignature

from .serializers import (
    LauncherReportListSerializer,
    LauncherReportDetailSerializer,
    RunImmediateSerializer,
    RunDeferredSerializer,
    ExecutionResultSerializer,
    ScheduleResultSerializer,
)
from .services import execute_report_query, export_results
from .tasks import run_report_task

logger = logging.getLogger(__name__)


class ScheduleListView(APIView):
    """GET /api/report-launcher/schedules/  - List all schedules.
    PATCH /api/report-launcher/schedules/<id>/toggle/  - Toggle active status.
    DELETE /api/report-launcher/schedules/<id>/  - Delete a schedule.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        schedules = ReportSchedule.objects.select_related('report', 'user').all()
        serializer = ReportScheduleSerializer(schedules, many=True)
        return Response(serializer.data)


class ScheduleToggleView(APIView):
    """PATCH /api/report-launcher/schedules/<id>/toggle/ - Toggle active."""
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        from django_celery_beat.models import PeriodicTask
        try:
            schedule = ReportSchedule.objects.get(pk=pk)
        except ReportSchedule.DoesNotExist:
            return Response({'error': 'Planification introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        schedule.is_active = not schedule.is_active
        schedule.save(update_fields=['is_active'])

        # Also toggle the celery beat periodic task
        if schedule.celery_task_id:
            PeriodicTask.objects.filter(name=schedule.celery_task_id).update(enabled=schedule.is_active)

        serializer = ReportScheduleSerializer(schedule)
        return Response(serializer.data)


class ScheduleDeleteView(APIView):
    """DELETE /api/report-launcher/schedules/<id>/ - Delete a schedule."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        from django_celery_beat.models import PeriodicTask
        try:
            schedule = ReportSchedule.objects.get(pk=pk)
        except ReportSchedule.DoesNotExist:
            return Response({'error': 'Planification introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # Remove celery beat task
        if schedule.celery_task_id:
            PeriodicTask.objects.filter(name=schedule.celery_task_id).delete()

        schedule.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExecutionListView(APIView):
    """GET /api/report-launcher/executions/  - List execution history."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            qs = ReportExecution.objects.all()[:200]
        else:
            qs = ReportExecution.objects.filter(user=request.user)[:200]
        serializer = ReportExecutionSerializer(qs, many=True)
        return Response(serializer.data)


class LauncherReportListView(APIView):
    """
    GET /api/report-launcher/reports/
    List reports the current user can execute.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reports = get_executable_reports_queryset(request.user)
        serializer = LauncherReportListSerializer(reports, many=True)
        return Response(serializer.data)


class ExecutionDownloadView(APIView):
    """
    GET /api/report-launcher/executions/{id}/download/?token=...
    Download a large report result file natively. No auth required since token is signed.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        token = request.query_params.get('token')
        if not token:
            return Response(
                {'error': 'Jeton manquant.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        signer = Signer()
        try:
            unsigned_pk = signer.unsign(token)
        except BadSignature:
            return Response(
                {'error': 'Le lien de téléchargement est invalide ou a expiré.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(pk) != unsigned_pk:
            return Response(
                {'error': 'Lien incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            execution = ReportExecution.objects.select_related('report').get(pk=pk)
        except ReportExecution.DoesNotExist:
            return Response(
                {'error': 'Exécution introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not execution.result_file:
            return Response(
                {'error': 'Le fichier de ce rapport n\'existe pas.'},
                status=status.HTTP_404_NOT_FOUND
            )

        from django.http import FileResponse
        try:
            filename = f"{execution.report.name}_{execution.started_at.strftime('%Y%m%d_%H%M%S')}.{execution.output_type.lower()}"
            response = FileResponse(execution.result_file.open('rb'), as_attachment=True, filename=filename)
            return response
        except FileNotFoundError:
            return Response(
                {'error': 'Fichier supprimé ou inaccessible sur le serveur.'},
                status=status.HTTP_404_NOT_FOUND
            )


class LauncherReportDetailView(APIView):
    """
    GET /api/report-launcher/reports/{id}/
    Get detailed info for launching a report.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            report = Report.objects.prefetch_related('parameters').get(pk=pk)
        except Report.DoesNotExist:
            return Response(
                {'error': 'Rapport introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not can_execute_report(request.user, report):
            return Response(
                {'error': "Vous n'avez pas le droit d'exécuter ce rapport."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = LauncherReportDetailSerializer(report)
        return Response(serializer.data)


class RunImmediateView(APIView):
    """
    POST /api/report-launcher/reports/{id}/run-immediate/
    Execute a report immediately.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            report = Report.objects.prefetch_related('parameters').get(pk=pk)
        except Report.DoesNotExist:
            return Response(
                {'error': 'Rapport introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not can_execute_report(request.user, report):
            return Response(
                {'error': "Vous n'avez pas le droit d'exécuter ce rapport."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = RunImmediateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Create execution record
        execution = ReportExecution.objects.create(
            report=report,
            user=request.user,
            parameters=data['parameters'],
            output_type=data['output_type'],
            routing_mode=data['routing_mode'],
            routing_config=data.get('routing_config', {}),
            status='pending',
        )

        if data['routing_mode'] == 'screen':
            # Synchronous execution – return file directly
            try:
                execution.status = 'running'
                execution.save(update_fields=['status'])

                columns, rows = execute_report_query(report, data['parameters'])
                content, content_type, extension = export_results(
                    columns, rows,
                    data['output_type'],
                    report.csv_separator
                )

                execution.status = 'success'
                execution.completed_at = tz.now()
                execution.save(update_fields=['status', 'completed_at'])

                # Return file as download
                filename = f"{report.name}_{execution.started_at.strftime('%Y%m%d_%H%M%S')}.{extension}"
                response = HttpResponse(content, content_type=content_type)
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                return response

            except Exception as e:
                execution.status = 'failed'
                execution.error_message = str(e)
                execution.completed_at = tz.now()
                execution.save(update_fields=['status', 'error_message', 'completed_at'])
                return Response(
                    {'error': f"Erreur lors de l'exécution : {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            # Asynchronous execution via Celery
            run_report_task.delay(execution.id)
            result_serializer = ExecutionResultSerializer(execution)
            return Response(result_serializer.data, status=status.HTTP_202_ACCEPTED)


class RunDeferredView(APIView):
    """
    POST /api/report-launcher/reports/{id}/run-deferred/
    Schedule a report for later execution.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            report = Report.objects.get(pk=pk)
        except Report.DoesNotExist:
            return Response(
                {'error': 'Rapport introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not can_execute_report(request.user, report):
            return Response(
                {'error': "Vous n'avez pas le droit d'exécuter ce rapport."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = RunDeferredSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Create schedule
        schedule = ReportSchedule.objects.create(
            report=report,
            user=request.user,
            parameters=data['parameters'],
            output_type=data['output_type'],
            routing_mode=data['routing_mode'],
            routing_config=data.get('routing_config', {}),
            schedule_type=data['schedule_type'],
            scheduled_at=data.get('scheduled_at'),
            cron_expression=data.get('cron_expression', ''),
            timezone=data.get('timezone', 'Europe/Paris'),
            is_active=True,
        )

        # Register with Celery Beat
        self._register_celery_beat(schedule)

        result_serializer = ScheduleResultSerializer(schedule)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)

    def _register_celery_beat(self, schedule):
        """Register the schedule with django-celery-beat."""
        from django_celery_beat.models import PeriodicTask, CrontabSchedule, ClockedSchedule
        import json

        task_name = f'report-schedule-{schedule.id}'

        if schedule.schedule_type == 'once' and schedule.scheduled_at:
            # One-time schedule using ClockedSchedule
            clocked, _ = ClockedSchedule.objects.get_or_create(
                clocked_time=schedule.scheduled_at
            )
            periodic_task = PeriodicTask.objects.create(
                name=task_name,
                task='launcher.tasks.run_scheduled_report',
                clocked=clocked,
                one_off=True,
                kwargs=json.dumps({'schedule_id': schedule.id}),
                enabled=True,
            )
        elif schedule.schedule_type == 'recurring' and schedule.cron_expression:
            # Recurring schedule using CrontabSchedule
            parts = schedule.cron_expression.split()
            if len(parts) == 5:
                minute, hour, day_of_month, month_of_year, day_of_week = parts
            else:
                minute, hour, day_of_month, month_of_year, day_of_week = '0', '*', '*', '*', '*'

            crontab, _ = CrontabSchedule.objects.get_or_create(
                minute=minute,
                hour=hour,
                day_of_month=day_of_month,
                month_of_year=month_of_year,
                day_of_week=day_of_week,
                defaults={'timezone': schedule.timezone}
            )
            periodic_task = PeriodicTask.objects.create(
                name=task_name,
                task='launcher.tasks.run_scheduled_report',
                crontab=crontab,
                kwargs=json.dumps({'schedule_id': schedule.id}),
                enabled=True,
            )
        else:
            return

        schedule.celery_task_id = task_name
        schedule.save(update_fields=['celery_task_id'])
