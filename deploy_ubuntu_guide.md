# Guide de Déploiement : FastReport sur Server Ubuntu

Ce guide détaille pas à pas l'installation et la configuration de l'application FastReport sur un nouveau serveur Ubuntu (ex: 22.04 LTS ou 24.04 LTS). 
L'application étant composée d'un backend (Django/Celery/Redis) et d'un frontend (React/Vite), nous allons configurer les services appropriés (`gunicorn`, `nginx`, `celery`).

---

## 1. Exécution du Script Préparatoire

J'ai préparé un script bash automatisé pour installer les dépendances de base (Python, Node.js, Redis, PostgreSQL) et compiler le projet.
Sur votre serveur, clonez d'abord le code source, puis créez et exécutez le script suivant.

**Fichier : `install.sh`**
```bash
#!/bin/bash
# Script d'installation FastReport pour serveur Linux (Ubuntu)

echo "Démarrage de l'installation de FastReport..."

# 1. Mise à jour du système et dépendances
echo "[1/4] Installation des dépendances système (Python, Redis, PostgreSQL, Nginx)..."
sudo apt update
sudo apt install -y python3 python3-venv python3-pip redis-server postgresql postgresql-contrib curl nginx

# 2. Installation de Node.js (v20)
if ! command -v node &> /dev/null
then
    echo "[2/4] Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "[2/4] Node.js est déjà installé."
fi

# 3. Configuration du Backend (Django)
echo "[3/4] Configuration du Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Création du fichier .env si inexistant
if [ ! -f ".env" ]; then
    echo "SECRET_KEY=votre_cle_secrete_longue_et_aleatoire" > .env
    echo "DEBUG=False" >> .env
    echo "CELERY_BROKER_URL=redis://localhost:6379/0" >> .env
    echo "DB_NAME=fastreport" >> .env
    echo "DB_USER=fastreport_user" >> .env
    echo "DB_PASSWORD=mot_de_passe_fort" >> .env
    echo "DB_HOST=localhost" >> .env
fi

python manage.py collectstatic --noinput
deactivate
cd ..

# 4. Configuration du Frontend (React/Vite)
echo "[4/4] Configuration du Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Dépendances installées avec succès !"
```

Rendez ce script exécutable et lancez-le :
```bash
chmod +x install.sh
./install.sh
```

---

## 2. Configuration de la Base de Données (PostgreSQL)

Connectez-vous à la base de données PostgreSQL pour créer l'utilisateur et la base de l'application :
```bash
sudo -u postgres psql
```

Exécutez les commandes SQL suivantes (modifiez le mot de passe !) :
```sql
CREATE DATABASE fastreport;
CREATE USER fastreport_user WITH PASSWORD 'mot_de_passe_fort';
ALTER ROLE fastreport_user SET client_encoding TO 'utf8';
ALTER ROLE fastreport_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE fastreport_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE fastreport TO fastreport_user;
-- Très important : octroyer les droits de schéma par défaut sur les nouvelles versions PG
\c fastreport
GRANT ALL ON SCHEMA public TO fastreport_user;
\q
```

Une fois la base configurer, appliquez les migrations Django :
```bash
cd backend
source venv/bin/activate
python manage.py migrate
# Créez un super-utilisateur (l'administrateur de l'application)
python manage.py createsuperuser
deactivate
cd ..
```

---

## 3. Configuration des Services Systemd (Lancement Automatique)

Pour que l'application tourne en arrière-plan et redémarre seule, nous allons créer les fichiers de configuration Systemd.
*Remplacer `/chemin/vers/FastReport` par votre chemin réel (ex: `/home/ubuntu/FastReport`)*.

### A. Backend - Gunicorn
Créer le fichier `/etc/systemd/system/fastreport-gunicorn.service` :
```ini
[Unit]
Description=gunicorn daemon for FastReport
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/chemin/vers/FastReport/backend
ExecStart=/chemin/vers/FastReport/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/chemin/vers/FastReport/backend/fastreport.sock \
          settings_project.wsgi:application

[Install]
WantedBy=multi-user.target
```

### B. Planificateur - Celery Worker
Créer le fichier `/etc/systemd/system/fastreport-celery.service` :
```ini
[Unit]
Description=Celery Worker for FastReport
After=network.target redis-server.service

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/chemin/vers/FastReport/backend
ExecStart=/chemin/vers/FastReport/backend/venv/bin/celery -A settings_project worker -l INFO
Restart=always

[Install]
WantedBy=multi-user.target
```

### C. Planificateur - Celery Beat
Créer le fichier `/etc/systemd/system/fastreport-celerybeat.service` :
```ini
[Unit]
Description=Celery Beat for FastReport
After=network.target redis-server.service

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/chemin/vers/FastReport/backend
ExecStart=/chemin/vers/FastReport/backend/venv/bin/celery -A settings_project beat -l INFO
Restart=always

[Install]
WantedBy=multi-user.target
```

**Activez et démarrez tous les services :**
```bash
sudo systemctl daemon-reload
sudo systemctl start fastreport-gunicorn fastreport-celery fastreport-celerybeat
sudo systemctl enable fastreport-gunicorn fastreport-celery fastreport-celerybeat
```

---

## 4. Configuration de NGINX (Serveur Web Frontal)

Nginx va servir les fichiers statiques du frontend construit par React, et rediriger les requêtes API (Commencants par `/api/` ou `/auth/` vers Gunicorn).

Créez le fichier `/etc/nginx/sites-available/fastreport` :
```nginx
server {
    listen 80;
    server_name votre_ip_ou_domaine.com;

    # Frontend React (Fichiers statiques compilés "dist")
    location / {
        root /chemin/vers/FastReport/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Fichiers statiques Django (Panel admin etc)
    location /static/ {
        alias /chemin/vers/FastReport/backend/staticfiles/;
    }

    # Redirection vers Gunicorn pour les routes API
    location ~ ^/(api|auth)/ {
        include proxy_params;
        proxy_pass http://unix:/chemin/vers/FastReport/backend/fastreport.sock;
    }
}
```

**Activez la configuration :**
```bash
sudo ln -s /etc/nginx/sites-available/fastreport /etc/nginx/sites-enabled
# Vérifier la syntaxe
sudo nginx -t
# Redémarrer Nginx
sudo systemctl restart nginx
```

🎉 **Terminé !** 
Vous pouvez accéder à votre application en entrant l'adresse IP de votre serveur dans le navigateur.
