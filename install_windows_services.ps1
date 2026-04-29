# install_windows_services.ps1
# Script automatisé pour installer et configurer FastReport en tant que services Windows (via NSSM).

Requires -RunAsAdministrator

Write-Host "==================================================" -ForegroundColor Green
Write-Host "Installation des services FastReport (Windows NSSM)" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

$AppDir = (Get-Item -Path ".\").FullName

# 1. Vérifier si NSSM est présent, sinon le télécharger
$NssmPath = "$AppDir\nssm-2.24\win64\nssm.exe"

if (-Not (Test-Path $NssmPath)) {
    Write-Host "NSSM non trouvé. Téléchargement de NSSM v2.24..." -ForegroundColor Yellow
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri "https://nssm.cc/release/nssm-2.24.zip" -OutFile "$AppDir\nssm.zip"
    Write-Host "Extraction de NSSM..." -ForegroundColor Yellow
    Expand-Archive -Path "$AppDir\nssm.zip" -DestinationPath $AppDir -Force
    Remove-Item "$AppDir\nssm.zip"
}

if (-Not (Test-Path $NssmPath)) {
    Write-Host "Erreur critique : Impossible de trouver nssm.exe après le téléchargement." -ForegroundColor Red
    exit
}

Write-Host "NSSM est prêt : $NssmPath" -ForegroundColor Cyan

# Variables d'exécution
$PythonExe = "$AppDir\backend\venv\Scripts\python.exe"
$CeleryExe = "$AppDir\backend\venv\Scripts\celery.exe"
$RedisExe  = "$AppDir\redis_portable\redis-server.exe"

# Vérifier si l'environnement est configuré
if (-Not (Test-Path $PythonExe)) {
    Write-Host "Erreur : L'environnement Python n'est pas configuré. Lancez install_windows.ps1 d'abord." -ForegroundColor Red
    exit
}

# Fonction pour créer un service
function Install-Service {
    param (
        [string]$ServiceName,
        [string]$AppPath,
        [string]$AppArgs,
        [string]$AppDirParam
    )
    
    Write-Host "Installation du service : $ServiceName" -ForegroundColor Cyan
    
    # Arrêter et supprimer s'il existe déjà
    if (Get-Service $ServiceName -ErrorAction SilentlyContinue) {
        Stop-Service $ServiceName -Force
        & $NssmPath remove $ServiceName confirm
    }
    
    & $NssmPath install $ServiceName $AppPath $AppArgs
    & $NssmPath set $ServiceName AppDirectory $AppDirParam
    & $NssmPath set $ServiceName AppStdout "$AppDirParam\Logs\$ServiceName.log"
    & $NssmPath set $ServiceName AppStderr "$AppDirParam\Logs\$ServiceName-error.log"
    
    # Créer le répertoire de logs s'il n'existe pas
    if (-Not (Test-Path "$AppDirParam\Logs")) {
        New-Item -ItemType Directory -Path "$AppDirParam\Logs" | Out-Null
    }
    
    Start-Service $ServiceName
}

# Création des services
# 1. Redis
if (Test-Path $RedisExe) {
    Install-Service -ServiceName "FastReport_Redis" -AppPath $RedisExe -AppArgs "" -AppDirParam "$AppDir\redis_portable"
} else {
    Write-Host "Redis portable non détecté. Assurez-vous qu'un serveur Redis tourne sur cette machine." -ForegroundColor Yellow
}

# 2. Django Backend
Install-Service -ServiceName "FastReport_Backend" -AppPath $PythonExe -AppArgs "manage.py runserver 0.0.0.0:8000" -AppDirParam "$AppDir\backend"

# 3. Celery Worker (Pool Solo pour Windows important)
Install-Service -ServiceName "FastReport_Celery_Worker" -AppPath $CeleryExe -AppArgs "-A config worker -l INFO --pool=solo" -AppDirParam "$AppDir\backend"

# 4. Celery Beat
Install-Service -ServiceName "FastReport_Celery_Beat" -AppPath $CeleryExe -AppArgs "-A config beat -l INFO" -AppDirParam "$AppDir\backend"

# 5. Frontend (Vite Preview)
# Trouver le chemin de npm.cmd
$NpmCmd = (Get-Command "npm" -ErrorAction SilentlyContinue).Source
if ($NpmCmd) {
    Install-Service -ServiceName "FastReport_Frontend" -AppPath $NpmCmd -AppArgs "run preview" -AppDirParam "$AppDir\frontend"
} else {
    Write-Host "Attention : npm non trouvé dans le PATH. Le service Frontend n'a pas pu être configuré." -ForegroundColor Red
}

Write-Host "==================================================" -ForegroundColor Green
Write-Host "Terminé ! Vos services FastReport tournent en arrière-plan !" -ForegroundColor Green
Write-Host "Testez : Ouvrez http://localhost:4173 (ou votre port frontend)."
Write-Host "Pour gérer, utilisez 'services.msc' (Services Windows)."
Write-Host "==================================================" -ForegroundColor Green
