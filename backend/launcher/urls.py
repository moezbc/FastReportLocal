from django.urls import path
from .views import (
    LauncherReportListView,
    LauncherReportDetailView,
    RunImmediateView,
    RunDeferredView,
    ExecutionListView,
    ScheduleListView,
    ScheduleToggleView,
    ScheduleDeleteView,
)

urlpatterns = [
    path('reports/', LauncherReportListView.as_view(), name='launcher-report-list'),
    path('reports/<int:pk>/', LauncherReportDetailView.as_view(), name='launcher-report-detail'),
    path('reports/<int:pk>/run-immediate/', RunImmediateView.as_view(), name='launcher-run-immediate'),
    path('reports/<int:pk>/run-deferred/', RunDeferredView.as_view(), name='launcher-run-deferred'),
    path('executions/', ExecutionListView.as_view(), name='execution-list'),
    path('schedules/', ScheduleListView.as_view(), name='schedule-list'),
    path('schedules/<int:pk>/toggle/', ScheduleToggleView.as_view(), name='schedule-toggle'),
    path('schedules/<int:pk>/', ScheduleDeleteView.as_view(), name='schedule-delete'),
]
