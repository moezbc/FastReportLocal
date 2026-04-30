from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import connections
from django.db.models import Q

from .models import Report, ReportParameter, ReportPermission
from .serializers import (
    ReportListSerializer, ReportDetailSerializer,
    ReportCreateUpdateSerializer, ReportPermissionSerializer,
)
from .permissions import CanModifyReport, can_modify_report


class ReportViewSet(viewsets.ModelViewSet):
    """CRUD ViewSet for Reports (admin / owner use)."""

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Report.objects.all()
        from .permissions import get_executable_reports_queryset
        # For list, show reports user can see (own + public + permitted)
        # We want to show reports where user is owner OR has can_modify=True
        return Report.objects.filter(
            Q(owner=user) | 
            Q(permissions__user=user, permissions__can_modify=True) |
            Q(permissions__group__in=user.groups.all(), permissions__can_modify=True)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'list':
            return ReportListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return ReportCreateUpdateSerializer
        return ReportDetailSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method in ('PUT', 'PATCH', 'DELETE'):
            if not can_modify_report(request.user, obj):
                self.permission_denied(request, message="Vous n'avez pas le droit de modifier ce rapport.")

    @action(detail=True, methods=['post'], url_path='test-query')
    def test_query(self, request, pk=None):
        """Test a report's SQL query with default parameters."""
        report = self.get_object()
        if not can_modify_report(request.user, report):
            return Response(
                {'error': "Vous n'avez pas le droit de tester ce rapport."},
                status=status.HTTP_403_FORBIDDEN
            )

        sql = report.sql_query
        params = {}
        for param in report.parameters.all():
            if param.default_value:
                params[param.name] = param.default_value

        try:
            # Use the report's datasource if configured, otherwise default
            if report.datasource:
                conn = report.datasource.get_connection()
                cursor = conn.cursor()

                # For Oracle, replace :param_name placeholders directly
                if report.datasource.db_type == 'oracle':
                    cursor.execute(sql, params)
                elif report.datasource.db_type == 'sqlserver':
                    processed_sql = sql
                    ordered_params = []
                    for param_name in params:
                        processed_sql = processed_sql.replace(f':{param_name}', '?')
                        ordered_params.append(params[param_name])
                    if ordered_params:
                        cursor.execute(processed_sql, ordered_params)
                    else:
                        cursor.execute(processed_sql)
                else:
                    # For PostgreSQL/MySQL, replace :param with %(param)s
                    processed_sql = sql
                    for param_name in params:
                        processed_sql = processed_sql.replace(f':{param_name}', f'%({param_name})s')
                    if params:
                        cursor.execute(processed_sql, params)
                    else:
                        cursor.execute(processed_sql)

                columns = [col[0] for col in cursor.description] if cursor.description else []
                rows = cursor.fetchmany(100)
                cursor.close()
                conn.close()
            else:
                # Fallback to Django default connection
                from django.db import connections
                with connections['default'].cursor() as cursor:
                    processed_sql = sql
                    for param_name in params:
                        processed_sql = processed_sql.replace(f':{param_name}', f'%({param_name})s')
                    if params:
                        cursor.execute(processed_sql, params)
                    else:
                        cursor.execute(processed_sql)
                    columns = [col[0] for col in cursor.description] if cursor.description else []
                    rows = cursor.fetchmany(100)

            return Response({
                'columns': columns,
                'rows': [dict(zip(columns, row)) for row in rows],
                'row_count': len(rows),
                'truncated': len(rows) == 100,
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get', 'post', 'delete'], url_path='permissions')
    def manage_permissions(self, request, pk=None):
        """Manage permissions for a report."""
        report = self.get_object()
        if not can_modify_report(request.user, report):
            return Response(
                {'error': "Vous n'avez pas le droit de gérer les permissions."},
                status=status.HTTP_403_FORBIDDEN
            )

        if request.method == 'GET':
            perms = report.permissions.all()
            serializer = ReportPermissionSerializer(perms, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            serializer = ReportPermissionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(report=report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == 'DELETE':
            perm_id = request.data.get('id')
            if not perm_id:
                return Response(
                    {'error': "ID de permission requis."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            report.permissions.filter(id=perm_id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class DashboardStatsView(viewsets.ViewSet):
    """
    API endpoint that returns dashboard statistics.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Count
        from .models import ReportExecution, ReportSchedule

        # 1. Total reports (accessible to user)
        if request.user.is_staff:
            total_reports = Report.objects.count()
        else:
            total_reports = (Report.objects.filter(owner=request.user) | Report.objects.filter(visibility='public')).distinct().count()

        # 2. Active Schedules (owned by user or all if admin? Let's stick to owned for now or permissions logic)
        # For simplicity, let's show all active schedules for staff, or owned for normal users
        if request.user.is_staff:
            active_schedules = ReportSchedule.objects.filter(is_active=True).count()
        else:
            active_schedules = ReportSchedule.objects.filter(
                user=request.user, is_active=True
            ).count()

        # 3. Recent Executions (Last 5)
        # Filter by user permissions (admin sees all? or just their own?)
        # Let's say admin sees all, users see theirs.
        if request.user.is_staff:
            recent_exec_qs = ReportExecution.objects.all()
        else:
            recent_exec_qs = ReportExecution.objects.filter(user=request.user)
        
        recent_executions = recent_exec_qs.select_related('report', 'user').order_by('-started_at')[:5]
        
        # Serialize recent executions manually or use a serializer
        recent_executions_data = []
        for exec in recent_executions:
            recent_executions_data.append({
                'id': exec.id,
                'report_name': exec.report.name,
                'status': exec.status,
                'started_at': exec.started_at,
                'user': exec.user.username
            })

        # 4. Execution Stats (Last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        # We want counts of success/failed per day ideally, or just total in last 7 days.
        # Let's do simple counts for now: Success vs Failed in last 7 days
        stats_qs = recent_exec_qs.filter(started_at__gte=seven_days_ago)
        
        execution_stats = {
            'success': stats_qs.filter(status='success').count(),
            'failed': stats_qs.filter(status='failed').count(),
            'total_last_7_days': stats_qs.count()
        }

        return Response({
            'total_reports': total_reports,
            'active_schedules': active_schedules,
            'recent_executions': recent_executions_data,
            'execution_stats': execution_stats
        })
