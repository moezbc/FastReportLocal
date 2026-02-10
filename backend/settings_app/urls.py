from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DataSourceViewSet, SmtpConfigViewSet, FtpConfigViewSet

router = DefaultRouter()
router.register(r'datasources', DataSourceViewSet, basename='datasource')
router.register(r'smtp', SmtpConfigViewSet, basename='smtp')
router.register(r'ftp', FtpConfigViewSet, basename='ftp')

urlpatterns = [
    path('', include(router.urls)),
]
