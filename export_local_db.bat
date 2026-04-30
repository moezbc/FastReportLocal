@echo off
echo ==============================================
echo Export de la base de donnees locale FastReport
echo ==============================================

echo Lancement de l'export depuis le conteneur Docker local...
docker exec -t fastreport-db pg_dump -U fastreport_user fastreport --clean --if-exists --no-owner --no-acl > export_fastreport.sql

echo.
echo Termine ! Le fichier "export_fastreport.sql" a ete cree.
echo Veuillez copier ce fichier sur votre serveur Linux.
pause
