@echo off
echo ============================================
echo   FastReport - Gestion des services
echo ============================================
echo.
echo   1. Redemarrage rapide (defaut)
echo   2. Reinstaller les dependances
echo      (apres modif requirements.txt
echo       ou package.json)
echo.

cd /d "%~dp0"

set /p CHOIX="Votre choix [1]: "
if "%CHOIX%"=="" set CHOIX=1

if "%CHOIX%"=="2" (
    echo.
    echo Arret + reconstruction des images...
    docker compose down
    docker compose build
    docker compose up -d
) else (
    echo.
    echo Redemarrage des conteneurs...
    docker compose restart
)

echo.
timeout /t 5 /nobreak >nul
docker compose ps
echo.
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8001
echo ============================================
pause
