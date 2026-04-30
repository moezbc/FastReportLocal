# Déployer FastReport avec un PostgreSQL partagé (ex: n8n) via Docker

Ce guide explique comment installer FastReport sur un serveur Linux en utilisant une base de données PostgreSQL qui est **déjà en cours d'exécution** dans un autre conteneur Docker (par exemple, celui d'une instance n8n).

La méthode recommandée consiste à **connecter les conteneurs FastReport au réseau Docker existant** de l'application tierce (n8n).

---

## Étape 1 : Préparer la base de données dans votre PostgreSQL existant

Il est fortement déconseillé de mélanger les tables de différentes applications dans la même base de données. Vous devez donc créer une base et un utilisateur dédiés pour FastReport.

1. Connectez-vous au conteneur PostgreSQL existant (remplacez `n8n_postgres` par le nom de votre conteneur) :
   ```bash
   docker exec -it n8n_postgres psql -U votre_user_root_postgres
   ```

2. Exécutez les commandes SQL suivantes pour créer la base et l'utilisateur :
   ```sql
   CREATE DATABASE fastreport;
   CREATE USER fastreport_user WITH PASSWORD 'mot_de_passe_fort';
   GRANT ALL PRIVILEGES ON DATABASE fastreport TO fastreport_user;
   \q
   ```


CREATE DATABASE fastreport;
CREATE USER fastreport_user WITH PASSWORD 'admin.2026$';
GRANT ALL PRIVILEGES ON DATABASE fastreport TO fastreport_user;
\q


---

## Étape 2 : Récupérer le nom du réseau Docker

FastReport a besoin d'être sur le même réseau Docker que PostgreSQL pour communiquer avec lui de manière sécurisée sans exposer les ports publiquement.

1. Listez vos réseaux Docker :
   ```bash
   docker network ls
   ```
2. Repérez le nom du réseau utilisé par n8n (il s'appelle souvent `n8n_default` ou un nom similaire défini dans votre autre docker-compose). Notez ce nom pour l'étape suivante.

---

## Étape 3 : Modifier le fichier `docker-compose.yml` de FastReport

Sur votre nouveau serveur, après avoir cloné le dépôt FastReport, ouvrez son fichier `docker-compose.yml` et effectuez les modifications suivantes :

1. **Supprimez le service de base de données :**
   Effacez entièrement le bloc `db:` (de `db:` jusqu'aux variables d'environnement et healthcheck).

2. **Retirez la dépendance au service `db` :**
   Sous le service `backend:`, dans la section `depends_on:`, supprimez le bloc concernant `db`.

3. **Supprimez le volume PostgreSQL :**
   À la toute fin du fichier, sous `volumes:`, effacez la ligne `postgres_data:`.

4. **Connectez FastReport au réseau existant :**
   À la fin du fichier, ajoutez la déclaration de réseau en spécifiant le nom trouvé à l'Étape 2 :
   ```yaml
   networks:
     default:
       name: NOM_DU_RESEAU_TROUVE_A_L_ETAPE_2
       external: true
   ```

---

## Étape 4 : Configurer le fichier `.env`

Copiez le fichier d'exemple pour créer votre configuration locale :
```bash
cp .env.example .env
```

Modifiez ensuite les variables suivantes dans votre fichier `.env` :

```env
# URL du Backend et Frontend (remplacez par l'IP de votre serveur ou votre nom de domaine)
BACKEND_URL=http://<IP_DU_SERVEUR>:8000
CORS_ALLOWED_ORIGINS=http://<IP_DU_SERVEUR>:5173

# Configuration PostgreSQL pointant vers le conteneur partagé
POSTGRES_DB=fastreport
POSTGRES_USER=fastreport_user
POSTGRES_PASSWORD=mot_de_passe_fort
# Utilisez le nom exact du conteneur PostgreSQL sur le réseau Docker (ex: n8n_postgres, db, etc.)
POSTGRES_HOST=nom_du_conteneur_postgres_n8n
POSTGRES_PORT=5432

# Redis configuré pour Docker Compose
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

---

## Étape 5 : Lancer l'installation et le déploiement

Une fois que vos fichiers `docker-compose.yml` et `.env` sont prêts, vous pouvez lancer la construction et le démarrage de FastReport :

```bash
docker compose up -d --build
```

**Que se passe-t-il ensuite ?**
* Docker va construire l'image `backend` et `frontend`.
* Il démarrera les conteneurs `backend`, `frontend`, `redis`, et les workers `celery`.
* Le backend appliquera automatiquement les migrations (`python manage.py migrate`) en se connectant à la base de données PostgreSQL de n8n via le réseau partagé.
