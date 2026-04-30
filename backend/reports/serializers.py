from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import Report, ReportParameter, ReportPermission, ReportExecution, ReportSchedule


class ReportParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportParameter
        fields = [
            'id', 'name', 'label', 'param_type', 'operators',
            'default_value', 'required', 'order', 'enum_values',
        ]


class ReportPermissionSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = ReportPermission
        fields = ['id', 'user', 'user_username', 'group', 'group_name', 'can_execute', 'can_modify']


class ReportListSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    datasource_name = serializers.CharField(source='datasource.name', read_only=True, default=None)

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'owner', 'owner_username',
            'datasource', 'datasource_name',
            'visibility', 'output_types', 'routing_modes',
            'csv_separator', 'category', 'email_body', 
            'embed_results', 'email_body_header', 'email_body_footer',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReportDetailSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    datasource_name = serializers.CharField(source='datasource.name', read_only=True, default=None)
    parameters = ReportParameterSerializer(many=True, read_only=True)
    permissions = ReportPermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'sql_query', 'owner', 'owner_username',
            'datasource', 'datasource_name',
            'visibility', 'output_types', 'routing_modes', 'csv_separator',
            'category', 'email_body',
            'embed_results', 'email_body_header', 'email_body_footer',
            'parameters', 'permissions',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReportCreateUpdateSerializer(serializers.ModelSerializer):
    parameters = ReportParameterSerializer(many=True, required=False)

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'sql_query', 'datasource',
            'visibility', 'output_types', 'routing_modes', 'csv_separator',
            'category', 'email_body',
            'embed_results', 'email_body_header', 'email_body_footer',
            'parameters',
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        parameters_data = validated_data.pop('parameters', [])
        report = Report.objects.create(**validated_data)
        for param_data in parameters_data:
            ReportParameter.objects.create(report=report, **param_data)
        return report

    def update(self, instance, validated_data):
        parameters_data = validated_data.pop('parameters', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if parameters_data is not None:
            # Replace all parameters
            instance.parameters.all().delete()
            for param_data in parameters_data:
                ReportParameter.objects.create(report=instance, **param_data)

        return instance


class ReportExecutionSerializer(serializers.ModelSerializer):
    report_name = serializers.CharField(source='report.name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ReportExecution
        fields = [
            'id', 'report', 'report_name', 'user', 'user_username',
            'parameters', 'output_type', 'routing_mode', 'routing_config',
            'status', 'started_at', 'completed_at', 'error_message',
        ]
        read_only_fields = ['id', 'started_at', 'completed_at']


class ReportScheduleSerializer(serializers.ModelSerializer):
    report_name = serializers.CharField(source='report.name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ReportSchedule
        fields = [
            'id', 'report', 'report_name', 'user', 'user_username',
            'parameters', 'output_type', 'routing_mode', 'routing_config',
            'schedule_type', 'scheduled_at', 'cron_expression', 'timezone',
            'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
