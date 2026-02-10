from django.db import models


class DataSource(models.Model):
    """External database connection for report execution."""

    DB_TYPE_CHOICES = [
        ('postgresql', 'PostgreSQL'),
        ('mysql', 'MySQL'),
        ('oracle', 'Oracle'),
        ('sqlserver', 'SQL Server'),
    ]

    DEFAULT_PORTS = {
        'postgresql': 5432,
        'mysql': 3306,
        'oracle': 1521,
        'sqlserver': 1433,
    }

    name = models.CharField(max_length=255, unique=True, verbose_name="Nom")
    db_type = models.CharField(
        max_length=20,
        choices=DB_TYPE_CHOICES,
        verbose_name="Type de base"
    )
    host = models.CharField(max_length=255, verbose_name="Hôte")
    port = models.IntegerField(verbose_name="Port")
    database_name = models.CharField(max_length=255, verbose_name="Nom de la base")
    username = models.CharField(max_length=255, verbose_name="Utilisateur")
    password = models.CharField(max_length=500, verbose_name="Mot de passe")
    options = models.JSONField(
        default=dict,
        blank=True,
        help_text="Paramètres de connexion supplémentaires (JSON)",
        verbose_name="Options"
    )
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Source de données"
        verbose_name_plural = "Sources de données"

    def __str__(self):
        return f"{self.name} ({self.get_db_type_display()} – {self.host})"

    def save(self, *args, **kwargs):
        if not self.port:
            self.port = self.DEFAULT_PORTS.get(self.db_type, 5432)
        super().save(*args, **kwargs)

    def get_connection(self):
        """Create and return a database connection for this datasource."""
        if self.db_type == 'postgresql':
            import psycopg2
            return psycopg2.connect(
                host=self.host, port=self.port,
                dbname=self.database_name,
                user=self.username, password=self.password,
                **self.options
            )
        elif self.db_type == 'mysql':
            import pymysql
            return pymysql.connect(
                host=self.host, port=self.port,
                database=self.database_name,
                user=self.username, password=self.password,
                **self.options
            )
        elif self.db_type == 'oracle':
            import oracledb
            dsn = f"{self.host}:{self.port}/{self.database_name}"
            return oracledb.connect(
                user=self.username, password=self.password,
                dsn=dsn
            )
        elif self.db_type == 'sqlserver':
            import pyodbc
            conn_str = (
                f"DRIVER={{ODBC Driver 17 for SQL Server}};"
                f"SERVER={self.host},{self.port};"
                f"DATABASE={self.database_name};"
                f"UID={self.username};PWD={self.password}"
            )
            return pyodbc.connect(conn_str, **self.options)
        else:
            raise ValueError(f"Type de base non supporté : {self.db_type}")

    def test_connection(self):
        """Test the connection and return (success, message)."""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            if self.db_type == 'oracle':
                cursor.execute("SELECT 1 FROM DUAL")
            else:
                cursor.execute("SELECT 1")
            cursor.close()
            conn.close()
            return True, "Connexion réussie"
        except Exception as e:
            return False, str(e)


class SmtpConfig(models.Model):
    """SMTP mail server configuration."""

    name = models.CharField(max_length=255, unique=True, verbose_name="Nom")
    host = models.CharField(max_length=255, verbose_name="Serveur SMTP")
    port = models.IntegerField(default=587, verbose_name="Port")
    username = models.CharField(max_length=255, blank=True, default='', verbose_name="Utilisateur")
    password = models.CharField(max_length=500, blank=True, default='', verbose_name="Mot de passe")
    use_tls = models.BooleanField(default=True, verbose_name="Utiliser TLS")
    from_email = models.EmailField(verbose_name="Adresse expéditeur")
    is_default = models.BooleanField(default=False, verbose_name="Par défaut")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_default', 'name']
        verbose_name = "Configuration SMTP"
        verbose_name_plural = "Configurations SMTP"

    def __str__(self):
        return f"{self.name} ({self.host}:{self.port})"

    def save(self, *args, **kwargs):
        if self.is_default:
            SmtpConfig.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def test_connection(self):
        """Test SMTP connectivity and authentication."""
        import smtplib
        try:
            if self.use_tls:
                server = smtplib.SMTP(self.host, self.port, timeout=15)
                server.starttls()
            else:
                server = smtplib.SMTP(self.host, self.port, timeout=15)
            if self.username and self.password:
                server.login(self.username, self.password)
            server.quit()
            return True, "Connexion SMTP réussie"
        except Exception as e:
            return False, str(e)

    def get_email_backend_kwargs(self):
        """Return kwargs for Django's SMTP email backend."""
        return {
            'host': self.host,
            'port': self.port,
            'username': self.username,
            'password': self.password,
            'use_tls': self.use_tls,
        }


class FtpConfig(models.Model):
    """FTP/SFTP server configuration."""

    PROTOCOL_CHOICES = [
        ('ftp', 'FTP'),
        ('sftp', 'SFTP'),
    ]

    name = models.CharField(max_length=255, unique=True, verbose_name="Nom")
    protocol = models.CharField(
        max_length=4,
        choices=PROTOCOL_CHOICES,
        default='sftp',
        verbose_name="Protocole"
    )
    host = models.CharField(max_length=255, verbose_name="Hôte")
    port = models.IntegerField(verbose_name="Port")
    username = models.CharField(max_length=255, verbose_name="Utilisateur")
    password = models.CharField(max_length=500, blank=True, default='', verbose_name="Mot de passe")
    remote_path = models.CharField(max_length=500, default='/', verbose_name="Chemin distant")
    is_default = models.BooleanField(default=False, verbose_name="Par défaut")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_default', 'name']
        verbose_name = "Configuration FTP/SFTP"
        verbose_name_plural = "Configurations FTP/SFTP"

    def __str__(self):
        return f"{self.name} ({self.get_protocol_display()} – {self.host})"

    def save(self, *args, **kwargs):
        if not self.port:
            self.port = 22 if self.protocol == 'sftp' else 21
        if self.is_default:
            FtpConfig.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)
