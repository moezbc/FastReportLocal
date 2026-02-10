from django.contrib import admin
from .models import DataSource, SmtpConfig, FtpConfig


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'db_type', 'host', 'port', 'database_name', 'is_active', 'updated_at')
    list_filter = ('db_type', 'is_active')
    search_fields = ('name', 'host', 'database_name')


@admin.register(SmtpConfig)
class SmtpConfigAdmin(admin.ModelAdmin):
    list_display = ('name', 'host', 'port', 'from_email', 'use_tls', 'is_default')
    list_filter = ('is_default', 'use_tls')


@admin.register(FtpConfig)
class FtpConfigAdmin(admin.ModelAdmin):
    list_display = ('name', 'protocol', 'host', 'port', 'remote_path', 'is_default')
    list_filter = ('protocol', 'is_default')
