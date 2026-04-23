# Script d'installation FastReport pour serveur Windows

Write-Host "Démarrage de l'installation de FastReport..." -ForegroundColor Green

# 1. Vérification de Python
if (-Not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    Write-Host "[Erreur] Python n'est pas installé ou n'est pas dans le PATH. Veuillez installer Python 3.10+." -ForegroundColor Red
    exit
}

# 2. Vérification de Node.js
if (-Not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "[Erreur] Node.js (npm) n'est pas installé ou n'est pas dans le PATH. Veuillez installer Node.js." -ForegroundColor Red
    exit
}

# 3. Configuration du Backend
Write-Host "[1/2] Configuration du Backend..." -ForegroundColor Cyan
Set-Location -Path ".\backend"

# Création de l'environnement virtuel
Write-Host "Création de l'environnement virtuel Python..."
python -m venv venv

# Activation et installation
& .\venv\Scripts\Activate.ps1
Write-Host "Installation des dépendances Python..."
pip install -r requirements.txt

# Fichier .env
if (-Not (Test-Path ".\backend\.env")) {
    Write-Host "Copie de .env.example vers backend\.env. Pensez à le configurer." -ForegroundColor Yellow
    if (Test-Path ".\.env.example") {
        Copy-Item -Path ".\.env.example" -Destination ".\backend\.env"
    }
}

Write-Host "Migration de la base de données et collecte statique..."
python manage.py migrate
python manage.py collectstatic --noinput

Set-Location -Path ".."

# 4. Configuration du Frontend
Write-Host "[2/2] Configuration du Frontend..." -ForegroundColor Cyan
Set-Location -Path ".\frontend"

Write-Host "Installation des dépendances Node.js et build..."
npm install
npm run build

Set-Location -Path ".."

Write-Host "======================================================" -ForegroundColor Green
Write-Host "Installation terminée avec succès !" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "Prochaines étapes :"
Write-Host "1. Assurez-vous d'avoir Redis et votre base de données en cours d'exécution."
Write-Host "2. Remplissez le fichier 'backend\.env'."
Write-Host "3. Utilisez 'start.bat' pour démarrer l'application sur le serveur Windows."
