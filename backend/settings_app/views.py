from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import DataSource, SmtpConfig, FtpConfig
from .serializers import (
    DataSourceSerializer, DataSourceListSerializer,
    SmtpConfigSerializer, FtpConfigSerializer,
)


class DataSourceViewSet(viewsets.ModelViewSet):
    """CRUD for external database connections."""
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'list':
            return DataSourceListSerializer
        return DataSourceSerializer

    @action(detail=True, methods=['post'], url_path='test-connection')
    def test_connection(self, request, pk=None):
        """Test connectivity to the external database."""
        datasource = self.get_object()
        success, message = datasource.test_connection()
        return Response({
            'success': success,
            'message': message,
        }, status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='active')
    def active_list(self, request):
        """Return only active datasources (for report form dropdowns)."""
        qs = DataSource.objects.filter(is_active=True)
        serializer = DataSourceListSerializer(qs, many=True)
        return Response(serializer.data)


class SmtpConfigViewSet(viewsets.ModelViewSet):
    """CRUD for SMTP server configurations."""
    queryset = SmtpConfig.objects.all()
    serializer_class = SmtpConfigSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_update(self, serializer):
        # If password not provided in update, keep existing
        instance = self.get_object()
        if 'password' not in self.request.data or self.request.data['password'] == '':
            serializer.save(password=instance.password)
        else:
            serializer.save()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], url_path='test-connection')
    def test_connection(self, request, pk=None):
        """Test SMTP connectivity."""
        smtp = self.get_object()
        success, message = smtp.test_connection()
        return Response({
            'success': success,
            'message': message,
        }, status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST)


class FtpConfigViewSet(viewsets.ModelViewSet):
    """CRUD for FTP/SFTP server configurations."""
    queryset = FtpConfig.objects.all()
    serializer_class = FtpConfigSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_update(self, serializer):
        instance = self.get_object()
        if 'password' not in self.request.data or self.request.data['password'] == '':
            serializer.save(password=instance.password)
        else:
            serializer.save()

    def perform_create(self, serializer):
        serializer.save()
