from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group
from settings_app.models import DataSource


class Report(models.Model):
    """A SQL report definition."""

    VISIBILITY_CHOICES = [
        ('private', 'Privé'),
        ('public', 'Public'),
    ]

    DEFAULT_OUTPUT_TYPES = ['CSV', 'XLSX', 'JSON', 'XML', 'PDF']
    DEFAULT_ROUTING_MODES = ['screen', 'email', 'sftp', 'ftp', 'local']

    name = models.CharField(max_length=255, verbose_name="Nom")
    description = models.TextField(blank=True, default='', verbose_name="Description")
    sql_query = models.TextField(verbose_name="Requête SQL")
    datasource = models.ForeignKey(
        DataSource,
        on_delete=models.PROTECT,
        related_name='reports',
        verbose_name="Source de données",
        null=True,
        blank=True,
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_reports',
        verbose_name="Propriétaire"
    )
    visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default='private',
        verbose_name="Visibilité"
    )
    output_types = models.JSONField(
        default=list,
        blank=True,
        help_text="Liste des types de sortie autorisés (CSV, XLSX, PDF, JSON, XML)",
        verbose_name="Types de sortie"
    )
    routing_modes = models.JSONField(
        default=list,
        blank=True,
        help_text="Modes de routage autorisés (screen, email, sftp, ftp, local)",
        verbose_name="Modes de routage"
    )
    csv_separator = models.CharField(
        max_length=5,
        default=',',
        verbose_name="Séparateur CSV"
    )

    CATEGORY_CHOICES = [
        ('Retail', 'Retail'),
        ('Finance', 'Finance'),
        ('industrie', 'Industrie'),
        ('distribution', 'Distribution'),
        ('Taiwan', 'Taiwan'),
    ]

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        null=True,
        blank=True,
        verbose_name="Catégorie"
    )
    email_body = models.TextField(
        blank=True,
        default='',
        verbose_name="Corps de l'email",
        help_text="Corps du message lors de l'envoi par email"
    )
    embed_results = models.BooleanField(
        default=False,
        verbose_name="Intégrer les résultats dans l'email",
        help_text="Si activé, les résultats seront insérés en tant que tableau HTML dans le corps de l'email"
    )
    email_body_header = models.TextField(
        blank=True, default='',
        verbose_name="Texte d'introduction email",
        help_text="Texte affiché avant le tableau des résultats dans l'email"
    )
    email_body_footer = models.TextField(
        blank=True, default='',
        verbose_name="Signature / Texte de fin email",
        help_text="Texte affiché après le tableau des résultats (signature)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = "Rapport"
        verbose_name_plural = "Rapports"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.output_types:
            self.output_types = self.DEFAULT_OUTPUT_TYPES
        if not self.routing_modes:
            self.routing_modes = self.DEFAULT_ROUTING_MODES
        super().save(*args, **kwargs)


class ReportParameter(models.Model):
    """A parameter for a report SQL query."""

    PARAM_TYPE_CHOICES = [
        ('string', 'Texte'),
        ('number', 'Nombre'),
        ('date', 'Date'),
        ('datetime', 'Date/Heure'),
        ('enum', 'Énumération'),
        ('boolean', 'Booléen'),
    ]

    DEFAULT_OPERATORS = ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IN', 'LIKE', 'IS NULL', 'IS NOT NULL']

    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name='parameters',
        verbose_name="Rapport"
    )
    name = models.CharField(max_length=100, verbose_name="Nom du paramètre")
    label = models.CharField(max_length=200, verbose_name="Libellé")
    param_type = models.CharField(
        max_length=20,
        choices=PARAM_TYPE_CHOICES,
        default='string',
        verbose_name="Type"
    )
    operators = models.JSONField(
        default=list,
        blank=True,
        help_text="Liste des opérateurs autorisés pour ce paramètre",
        verbose_name="Opérateurs"
    )
    default_value = models.CharField(
        max_length=500,
        blank=True,
        default='',
        verbose_name="Valeur par défaut"
    )
    required = models.BooleanField(default=False, verbose_name="Obligatoire")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    enum_values = models.JSONField(
        default=list,
        blank=True,
        help_text="Valeurs possibles pour le type enum",
        verbose_name="Valeurs enum"
    )

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Paramètre"
        verbose_name_plural = "Paramètres"
        unique_together = ['report', 'name']

    def __str__(self):
        return f"{self.report.name} – {self.label}"

    def save(self, *args, **kwargs):
        if not self.operators:
            self.operators = ['=']
        super().save(*args, **kwargs)


class ReportPermission(models.Model):
    """Fine-grained permission for a report (user or group level)."""

    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name='permissions',
        verbose_name="Rapport"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='report_permissions',
        verbose_name="Utilisateur"
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='report_permissions',
        verbose_name="Groupe"
    )
    can_execute = models.BooleanField(default=False, verbose_name="Peut exécuter")
    can_modify = models.BooleanField(default=False, verbose_name="Peut modifier")

    class Meta:
        verbose_name = "Permission de rapport"
        verbose_name_plural = "Permissions de rapport"

    def __str__(self):
        target = self.user or self.group
        return f"{self.report.name} → {target}"


class ReportExecution(models.Model):
    """Log of a report execution."""

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('running', 'En cours'),
        ('success', 'Succès'),
        ('failed', 'Échoué'),
    ]

    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name='executions',
        verbose_name="Rapport"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='report_executions',
        verbose_name="Utilisateur"
    )
    parameters = models.JSONField(default=dict, blank=True, verbose_name="Paramètres")
    output_type = models.CharField(max_length=10, verbose_name="Type de sortie")
    routing_mode = models.CharField(max_length=20, verbose_name="Mode de routage")
    routing_config = models.JSONField(default=dict, blank=True, verbose_name="Configuration routage")
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Statut"
    )
    started_at = models.DateTimeField(auto_now_add=True, verbose_name="Démarré à")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Terminé à")
    result_file = models.FileField(
        upload_to='report_results/%Y/%m/%d/',
        null=True,
        blank=True,
        verbose_name="Fichier résultat"
    )
    error_message = models.TextField(blank=True, default='', verbose_name="Message d'erreur")

    class Meta:
        ordering = ['-started_at']
        verbose_name = "Exécution de rapport"
        verbose_name_plural = "Exécutions de rapports"

    def __str__(self):
        return f"{self.report.name} – {self.status} – {self.started_at}"


class ReportSchedule(models.Model):
    """A scheduled (deferred) report execution."""

    SCHEDULE_TYPE_CHOICES = [
        ('once', 'Une fois'),
        ('recurring', 'Récurrent'),
    ]

    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name='schedules',
        verbose_name="Rapport"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='report_schedules',
        verbose_name="Utilisateur"
    )
    parameters = models.JSONField(default=dict, blank=True, verbose_name="Paramètres")
    output_type = models.CharField(max_length=10, verbose_name="Type de sortie")
    routing_mode = models.CharField(max_length=20, verbose_name="Mode de routage")
    routing_config = models.JSONField(default=dict, blank=True, verbose_name="Configuration routage")
    schedule_type = models.CharField(
        max_length=10,
        choices=SCHEDULE_TYPE_CHOICES,
        default='once',
        verbose_name="Type de planification"
    )
    scheduled_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date d'exécution prévue"
    )
    cron_expression = models.CharField(
        max_length=100,
        blank=True,
        default='',
        verbose_name="Expression cron"
    )
    timezone = models.CharField(
        max_length=50,
        default='Europe/Paris',
        verbose_name="Fuseau horaire"
    )
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    celery_task_id = models.CharField(
        max_length=255,
        blank=True,
        default='',
        verbose_name="ID tâche Celery Beat"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Planification de rapport"
        verbose_name_plural = "Planifications de rapports"

    def __str__(self):
        return f"{self.report.name} – {self.schedule_type} – {'Actif' if self.is_active else 'Inactif'}"
