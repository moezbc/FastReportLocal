from rest_framework import serializers
from .models import DataSource, SmtpConfig, FtpConfig


class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = [
            'id', 'name', 'db_type', 'host', 'port',
            'database_name', 'username', 'password', 'options',
            'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['password_set'] = bool(instance.password)
        return ret

    def update(self, instance, validated_data):
        # Don't overwrite password if not provided or empty
        password = validated_data.get('password', None)
        if not password:
            validated_data.pop('password', None)
        return super().update(instance, validated_data)


class DataSourceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for dropdowns / lists."""
    class Meta:
        model = DataSource
        fields = ['id', 'name', 'db_type', 'host', 'database_name', 'is_active']


class SmtpConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmtpConfig
        fields = [
            'id', 'name', 'host', 'port', 'username', 'password',
            'use_tls', 'from_email', 'is_default',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['password_set'] = bool(instance.password)
        return ret

    def update(self, instance, validated_data):
        # Don't overwrite password if not provided or empty
        password = validated_data.get('password', None)
        if not password:
            validated_data.pop('password', None)
        return super().update(instance, validated_data)


class FtpConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = FtpConfig
        fields = [
            'id', 'name', 'protocol', 'host', 'port',
            'username', 'password', 'remote_path', 'is_default',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['password_set'] = bool(instance.password)
        return ret

    def update(self, instance, validated_data):
        # Don't overwrite password if not provided or empty
        password = validated_data.get('password', None)
        if not password:
            validated_data.pop('password', None)
        return super().update(instance, validated_data)
