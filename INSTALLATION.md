# Guide d'Installation de FastReport

Ce guide détaille deux méthodes pour installer et lancer l'application FastReport, ainsi que la configuration des paramètres système (Bases de données, SMTP, etc.). 
L'application est composée d'un Backend (Django/Python), d'un Frontend (React/Vite), avec Redis et Celery pour le traitement en tâche de fond.

Choisissez l'une des deux méthodes d’installation : **Directe (Hôte/Bare-Metal)** ou **Via Docker**.

---

## Mettre en Place la Configuration (.env)
Quelle que soit la méthode choisie, FastReport se base sur un fichier `.env`.

1. Au niveau de la racine du projet, vous avez un fichier `.env.example`.
2. Faites-en une copie nommée `.env`.
3. Configurez les identifiants pour qu'ils soient sécurisés (surtout la variable `SECRET_KEY` et la partie `POSTGRES`).

> [!TIP]
> Si vous utilisez la base de données PostgreSQL de base fournie par **Docker**, vous pouvez laisser les valeurs PostgreSQL par défaut.

---

## Méthode 1 : Installation Via Docker (Recommandée & Multi-plateformes)
Docker est le moyen le plus simple pour faire tourner tout FastReport puisque l'environnement est géré pour vous.
**Pré-requis** : [Docker Desktop](https://www.docker.com/products/docker-desktop/) ou Docker Compose installé.

### Lancement
Ouvrez un terminal ou invite de commande à la racine du dossier FastReport :
```bash
docker-compose up -d --build
```

Vos services démarreront en tâche de fond :
- **Application Web FastReport** : accessible via [http://localhost:5173](http://localhost:5173) (ou le port que vous avez choisi).
- **Backend API** : port `8000`.
- **PostgreSQL et Redis** : intégrés et pré-configurés !

---

## Méthode 2 : Installation Directe sur Serveur / Machine (Bare-Metal)

Si vous préférez installer Python, Node.js et lancer les différents services nativement.
**Pré-requis** :
- Python 3.10 ou supérieur.
- Node.js version 20.
- Base de données locale (ou externe) : PostgreSQL, MySQL, SQL Server, etc.
- **SQL Server (optionnel)** : Vous aurez besoin de [ODBC Driver for SQL Server](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16).

### Sur Windows
Ouvrez PowerShell (en Administrateur) et exécutez le script d'installation qui va automatiser la création des environnements et l'installation des dépendances (`pyodbc`, `paramiko`, etc.) :
```powershell
.\install_windows.ps1
```
*(Le script copiera automatiquement `\.env.example` s'il n'y a pas de `\.env` dans votre backend.)*

Pour lancer l'application ensuite :
Exécutez simpement `start.bat`. N'oubliez pas que vous devez avoir un service **Redis** local qui tourne (votre fichier de configuration supporte un `redis_portable`).

### Sur Linux (Debian/Ubuntu)
Ouvrez un terminal et appliquez les droits :
```bash
chmod +x install_linux.sh
./install_linux.sh
```
Ce script installera `unixodbc-dev`, `python3-venv`, `redis-server`, compilera votre frontend et backend, et préparera votre environnement.

### Transformer en Vrai Services de fond (Recommandé)

Pour éviter d'avoir à lancer `start.bat` manuellement, et pour que l'application redémarre toute seule au boot :
- **Sous Windows** : Exécutez le script (en Admin) `install_windows_services.ps1`. Il téléchargera l'outil officiel NSSM et vous créera proprement 5 Services Windows (Moteur Web, Planificateur, etc) visibles dans votre gestionnaire "services.msc".
- **Sous Linux** : Exécutez simplement la commande `sudo ./install_linux_services.sh`. Elle déploiera tout l'environnement dans le système natif `systemd` !

---

## Post-Installation : Première Configuration

Une fois le backend lancé (via Docker ou local), il faut créer le premier administrateur pour l'interface :

**Si Hôte/Windows Local :**
```bash
cd backend
python manage.py createsuperuser
```

**Si Docker :**
```bash
docker exec -it fastreport-backend python manage.py createsuperuser
```
Suivez ensuite les instructions (adresse mail, mot de passe...).

---

## Fonctionnement - Ajouter des "Sources de Données"

Toutes les connexions (bases de données externes ou serveurs SFTP) depuis lesquelles extraire et envoyer vos rapports se gèrent dans l'**Interface d'Administration Django**.

### Par exemple, ajouter une base 'SQL Server' :
Assurez-vous que votre HOST a accès au serveur sur le port 1433 localement (ou via votre tunnel).
1. Accédez au panel Settings (Paramètres) ou directement dans `/admin`.
2. Allez dans *Sources de données* > *Ajouter*.
3. Choisissez "SQL Server". Remplissez l'IP, le port, et l'identifiant. *Le backend utilise le plugin `pyodbc` pour faire le lien*.
4. Cliquez "Tester la connexion" !

### Routing des E-mails
Dans la partie SMTP Config de FastReport :
- Host : `smtp.gmail.com`
- Port : `587`
- TLS : Cochez *Oui*.
- Fournissez l'adresse mail et le **Mot de passe d'application** si vous utilisez Google / Outlook.

> [!NOTE]
> Il est impératif que Celery Worker soit bien en cours d’exécution (fourni de base dans `docker-compose.yml` ou `start.bat`) pour que l'envoi d'e-mail des rapports fonctionne en asynchrone !
