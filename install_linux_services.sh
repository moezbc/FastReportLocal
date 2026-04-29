#!/bin/bash
# fastreport_linux_services.sh
# Script automatisé pour installer et configurer FastReport en tant que services systemd sous Linux.

set -e

if [ "$EUID" -ne 0 ]; then 
  echo "Veuillez exécuter ce script en tant que root (sudo ./install_linux_services.sh)"
  exit 1
fi

echo "=================================================="
echo "Installation des services FastReport (Systemd)"
echo "=================================================="

APP_DIR=$(pwd)
USER_NAME=$(logname || echo $SUDO_USER)

if [ -z "$USER_NAME" ] || [ "$USER_NAME" = "root" ]; then
    USER_NAME="ubuntu" # Fallback if run directly as root without sudo
    echo "Attention, l'utilisateur exécutant les services sera défini sur: $USER_NAME"
    echo "Si ce n'est pas correct, annulez (Ctrl+C) et modifiez le script."
    sleep 3
else
    echo "Utilisateur de service détecté: $USER_NAME"
fi

if [ ! -d "$APP_DIR/backend/venv" ]; then
    echo "Erreur: Le répertoire $APP_DIR/backend/venv n'existe pas."
    echo "Veuillez d'abord exécuter install_linux.sh pour configurer l'environnement."
    exit 1
fi

echo "[1/4] Configuration du service Backend (Gunicorn)..."
cat << EOF > /etc/systemd/system/fastreport-backend.service
[Unit]
Description=FastReport Backend (Gunicorn)
After=network.target redis-server.service

[Service]
User=$USER_NAME
WorkingDirectory=$APP_DIR/backend
Environment="PATH=$APP_DIR/backend/venv/bin:$PATH"
ExecStart=$APP_DIR/backend/venv/bin/gunicorn config.wsgi:application --workers 3 --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "[2/4] Configuration du service Celery Worker..."
cat << EOF > /etc/systemd/system/fastreport-celery.service
[Unit]
Description=FastReport Celery Worker
After=network.target redis-server.service

[Service]
User=$USER_NAME
WorkingDirectory=$APP_DIR/backend
Environment="PATH=$APP_DIR/backend/venv/bin:$PATH"
ExecStart=$APP_DIR/backend/venv/bin/celery -A config worker -l INFO
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "[3/4] Configuration du service Celery Beat..."
cat << EOF > /etc/systemd/system/fastreport-celerybeat.service
[Unit]
Description=FastReport Celery Beat
After=network.target redis-server.service

[Service]
User=$USER_NAME
WorkingDirectory=$APP_DIR/backend
Environment="PATH=$APP_DIR/backend/venv/bin:$PATH"
ExecStart=$APP_DIR/backend/venv/bin/celery -A config beat -l INFO
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "[4/4] Configuration du service Frontend (npm run preview)..."
cat << EOF > /etc/systemd/system/fastreport-frontend.service
[Unit]
Description=FastReport Frontend
After=network.target

[Service]
User=$USER_NAME
WorkingDirectory=$APP_DIR/frontend
# Ensure node is in PATH (you might need to adjust if node is locally installed e.g. nvm)
ExecStart=/usr/bin/env npm run preview
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Rechargement de systemd..."
systemctl daemon-reload

echo "Activation des services pour le lancement au démarrage..."
systemctl enable fastreport-backend fastreport-celery fastreport-celerybeat fastreport-frontend

echo "Démarrage des services..."
systemctl restart fastreport-backend fastreport-celery fastreport-celerybeat fastreport-frontend

echo "=================================================="
echo "Super ! Les services FastReport tournent en arrière-plan."
echo "Vous pouvez vérifier leur état avec par exemple :"
echo "sudo systemctl status fastreport-backend"
echo "=================================================="
