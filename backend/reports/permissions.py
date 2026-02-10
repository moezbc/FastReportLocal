from django.db.models import Q
from rest_framework import permissions


def can_execute_report(user, report):
    """Check if user can execute a report."""
    # Owner can always execute
    if report.owner == user:
        return True
    # Admins can always execute
    if user.is_staff:
        return True
    # Public reports are executable by everyone
    if report.visibility == 'public':
        return True
    # Check explicit permission (user or group)
    user_groups = user.groups.all()
    return report.permissions.filter(
        Q(user=user, can_execute=True) |
        Q(group__in=user_groups, can_execute=True)
    ).exists()


def can_modify_report(user, report):
    """Check if user can modify a report."""
    # Owner can always modify
    if report.owner == user:
        return True
    # Admins can always modify
    if user.is_staff:
        return True
    # Public reports: check explicit can_modify
    # Private reports: check explicit can_modify
    user_groups = user.groups.all()
    return report.permissions.filter(
        Q(user=user, can_modify=True) |
        Q(group__in=user_groups, can_modify=True)
    ).exists()


def get_executable_reports_queryset(user):
    """Return queryset of reports the user can execute."""
    from reports.models import Report

    if user.is_staff:
        return Report.objects.all()

    user_groups = user.groups.all()
    return Report.objects.filter(
        Q(owner=user) |
        Q(visibility='public') |
        Q(permissions__user=user, permissions__can_execute=True) |
        Q(permissions__group__in=user_groups, permissions__can_execute=True)
    ).distinct()


class CanExecuteReport(permissions.BasePermission):
    """DRF permission: can the user execute this report?"""

    def has_object_permission(self, request, view, obj):
        return can_execute_report(request.user, obj)


class CanModifyReport(permissions.BasePermission):
    """DRF permission: can the user modify this report?"""

    def has_object_permission(self, request, view, obj):
        return can_modify_report(request.user, obj)


class IsOwnerOrAdmin(permissions.BasePermission):
    """DRF permission: is the user the owner or an admin?"""

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or request.user.is_staff
