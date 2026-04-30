@echo off
echo ==============================================
echo Export de la base de donnees locale FastReport
echo ==============================================

echo Lancement de l'export depuis votre installation locale de PostgreSQL...
set PGPASSWORD=Admin123
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U postgres -h localhost -p 5432 fastreport --clean --if-exists --no-owner --no-acl > export_fastreport.sql

echo.
echo Termine ! Le fichier "export_fastreport.sql" a ete cree.
echo Veuillez copier ce fichier sur votre serveur Linux.
pause
