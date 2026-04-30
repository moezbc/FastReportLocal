from rest_framework import serializers
from reports.models import Report, ReportParameter, ReportExecution, ReportSchedule


class LauncherReportListSerializer(serializers.ModelSerializer):
    """Serializer for listing executable reports in the launcher."""
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    parameter_count = serializers.IntegerField(source='parameters.count', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'owner_username',
            'visibility', 'output_types', 'routing_modes',
            'parameter_count', 'updated_at',
        ]


class LauncherParameterSerializer(serializers.ModelSerializer):
    """Serializer for report parameters in the launcher."""
    class Meta:
        model = ReportParameter
        fields = [
            'id', 'name', 'label', 'param_type', 'operators',
            'default_value', 'required', 'order', 'enum_values',
        ]


class LauncherReportDetailSerializer(serializers.ModelSerializer):
    """Serializer for report detail in the launcher (execution-focused)."""
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    parameters = LauncherParameterSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'owner_username',
            'visibility', 'output_types', 'routing_modes',
            'csv_separator', 'parameters', 'updated_at',
            'embed_results', 'email_body_header', 'email_body_footer', 'email_body',
        ]


class RunImmediateSerializer(serializers.Serializer):
    """Input for immediate report execution."""
    parameters = serializers.DictField(required=False, default=dict)
    output_type = serializers.ChoiceField(choices=['CSV', 'XLSX', 'JSON', 'XML', 'PDF'])
    routing_mode = serializers.ChoiceField(choices=['screen', 'email', 'sftp', 'ftp', 'local'])
    routing_config = serializers.DictField(required=False, default=dict)


class RunDeferredSerializer(serializers.Serializer):
    """Input for deferred report execution (scheduling)."""
    parameters = serializers.DictField(required=False, default=dict)
    output_type = serializers.ChoiceField(choices=['CSV', 'XLSX', 'JSON', 'XML', 'PDF'])
    routing_mode = serializers.ChoiceField(choices=['screen', 'email', 'sftp', 'ftp', 'local'])
    routing_config = serializers.DictField(required=False, default=dict)
    schedule_type = serializers.ChoiceField(choices=['once', 'recurring'])
    scheduled_at = serializers.DateTimeField(required=False, allow_null=True)
    cron_expression = serializers.CharField(required=False, allow_blank=True, default='')
    timezone = serializers.CharField(required=False, default='Europe/Paris')


class ExecutionResultSerializer(serializers.ModelSerializer):
    """Output for a report execution."""
    report_name = serializers.CharField(source='report.name', read_only=True)

    class Meta:
        model = ReportExecution
        fields = [
            'id', 'report', 'report_name', 'status',
            'output_type', 'routing_mode', 'started_at', 'completed_at',
            'error_message',
        ]


class ScheduleResultSerializer(serializers.ModelSerializer):
    """Output for a created schedule."""
    report_name = serializers.CharField(source='report.name', read_only=True)

    class Meta:
        model = ReportSchedule
        fields = [
            'id', 'report', 'report_name', 'schedule_type',
            'scheduled_at', 'cron_expression', 'timezone',
            'is_active', 'output_type', 'routing_mode',
            'created_at',
        ]
