#!/bin/bash
# Script d'installation FastReport pour serveur Linux (Ubuntu/Debian)

echo "Démarrage de l'installation de FastReport..."

# 1. Mise à jour du système et installation des dépendances système
echo "[1/4] Installation des dépendances système (Python, Redis, PostgreSQL, unixodbc)..."
sudo apt-get update
sudo apt-get install -y python3 python3-venv python3-pip redis-server postgresql postgresql-contrib curl unixodbc-dev

# 2. Installation de Node.js (Si non installé)
if ! command -v node &> /dev/null
then
    echo "[2/4] Installation de Node.js (v20)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "[2/4] Node.js est déjà installé."
fi

# 3. Configuration du Backend (Django)
echo "[3/4] Configuration du Backend..."

# Copie du fichier .env.example s'il n'y a pas de .env
if [ ! -f "backend/.env" ]; then
    echo "Copie de .env.example vers backend/.env. Pensez à configurer vos options!"
    cp .env.example backend/.env
fi

cd backend
# Création de l'environnement virtuel et installation des dépendances
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Migration de la base de données et collecte des fichiers statiques
python manage.py migrate
python manage.py collectstatic --noinput
deactivate
cd ..

# 4. Configuration du Frontend (React/Vite)
echo "[4/4] Configuration du Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "======================================================"
echo "Installation terminée avec succès !"
echo "======================================================"
echo "Prochaines étapes :"
echo "1. Configurez votre base de données PostgreSQL."
echo "2. Remplissez le fichier 'backend/.env' avec vos accès."
echo "3. Démarrez les services avec Gunicorn, Celery, et servez le Frontend via Nginx ou Caddy, ou via 'docker-compose up -d'."
