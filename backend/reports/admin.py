from django.contrib import admin
from .models import Report, ReportParameter, ReportPermission, ReportExecution, ReportSchedule


class ReportParameterInline(admin.TabularInline):
    model = ReportParameter
    extra = 1


class ReportPermissionInline(admin.TabularInline):
    model = ReportPermission
    extra = 0


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'visibility', 'created_at', 'updated_at']
    list_filter = ['visibility', 'owner']
    search_fields = ['name', 'description']
    inlines = [ReportParameterInline, ReportPermissionInline]


@admin.register(ReportParameter)
class ReportParameterAdmin(admin.ModelAdmin):
    list_display = ['report', 'name', 'label', 'param_type', 'required', 'order']
    list_filter = ['param_type', 'required']


@admin.register(ReportPermission)
class ReportPermissionAdmin(admin.ModelAdmin):
    list_display = ['report', 'user', 'group', 'can_execute', 'can_modify']


@admin.register(ReportExecution)
class ReportExecutionAdmin(admin.ModelAdmin):
    list_display = ['report', 'user', 'output_type', 'routing_mode', 'status', 'started_at']
    list_filter = ['status', 'output_type', 'routing_mode']
    readonly_fields = ['started_at', 'completed_at']


@admin.register(ReportSchedule)
class ReportScheduleAdmin(admin.ModelAdmin):
    list_display = ['report', 'user', 'schedule_type', 'is_active', 'scheduled_at', 'created_at']
    list_filter = ['schedule_type', 'is_active']
