# Architecture de l'Application FastReport

Ce document détaille l'architecture technique de l'application FastReport, ainsi que le rôle spécifique de chaque outil et composant de l'écosystème. L'application repose sur une architecture moderne séparant le frontend, le backend, et les processus asynchrones, le tout orchestré par Docker.

## 1. Interface Utilisateur (Frontend)

C'est la partie visible par l'utilisateur, fonctionnant directement dans le navigateur web (Single Page Application).

*   **React (avec TypeScript)** : Bibliothèque principale utilisée pour construire l'interface. Elle permet de créer des composants interactifs et réutilisables (ex: `ReportCard.tsx`). TypeScript apporte une sécurité supplémentaire en typant le code.
*   **Vite** : Outil de construction (build tool) et serveur de développement. Il sert à compiler le code React extrêmement rapidement et à rafraîchir la page instantanément pendant le développement (Hot Module Replacement).
*   **Tailwind CSS** : Framework de style utilisé pour le design global. Il permet de styliser les éléments directement dans le code React en utilisant des classes utilitaires (ex: `text-white`, `bg-blue-500`), ce qui évite de maintenir des fichiers CSS séparés.
*   **Axios** : Client HTTP utilisé par le frontend pour envoyer des requêtes et communiquer avec le backend (API REST) afin de lire ou modifier des données.

## 2. Serveur et Logique Métier (Backend)

C'est le "cerveau" de l'application, qui gère la sécurité, les règles de gestion, et l'orchestration des données.

*   **Django** : Framework web robuste développé en Python. Il fournit la structure de base du backend, gère l'authentification des utilisateurs, et s'occupe de la communication avec la base de données principale (via son ORM).
*   **Django REST Framework (DRF)** : Extension de Django permettant de créer facilement et de manière sécurisée l'API REST que le frontend va interroger pour échanger des données au format JSON.
*   **Gunicorn** : Serveur web Python (serveur WSGI) utilisé en production. Il fait le lien entre les requêtes web entrantes et le code Django, et est conçu pour traiter de multiples requêtes simultanées de manière performante.
*   **Outils de génération (Openpyxl, ReportLab)** : Bibliothèques Python permettant au backend de générer concrètement les fichiers finaux (création de tableaux Excel avec Openpyxl et de documents PDF avec ReportLab).
*   **Connecteurs de bases de données (PyODBC, PyMySQL, OracleDB)** : Outils permettant au backend d'établir des connexions dynamiques vers les différentes bases de données externes des clients afin d'y exécuter les requêtes SQL définies dans les rapports.

## 3. Base de Données Principale

*   **PostgreSQL** : Base de données relationnelle principale de l'application. Elle stocke de manière permanente toutes les métadonnées vitales de FastReport : informations des utilisateurs, définition et configuration des rapports, historique des exécutions, et paramètres de planification.

## 4. Tâches en Arrière-Plan et Planification (Écosystème Celery)

Générer des rapports lourds ou envoyer des emails prend du temps. Pour éviter que le backend ne bloque l'interface utilisateur pendant ce temps, ces actions sont traitées de manière asynchrone (en arrière-plan).

*   **Redis** : Base de données en mémoire agissant ici principalement comme un "courtier de messages" (Message Broker). Lorsque le backend doit lancer un rapport, il dépose une "tâche" dans Redis.
*   **Celery Worker** : Processus indépendant qui écoute Redis en permanence. Dès qu'une nouvelle tâche apparaît (ex: "Générer le rapport #12"), le Worker la récupère et effectue le travail lourd (connexion SQL, génération du fichier, envoi du mail) sans ralentir le serveur web principal.
*   **Celery Beat (avec django_celery_beat)** : C'est le planificateur interne (équivalent d'un cron job). Il vérifie en continu s'il existe des rapports programmés pour une certaine date ou heure. Lorsque l'heure est atteinte, Celery Beat crée automatiquement la tâche correspondante et la dépose dans Redis pour qu'un Celery Worker l'exécute.

## 5. Résumé des interactions (Workflow d'une exécution)

1. L'utilisateur clique sur le bouton "Générer" depuis l'interface **React**.
2. Le frontend envoie une requête API au serveur **Django (via Gunicorn)**.
3. Le backend enregistre la demande d'exécution dans **PostgreSQL** et envoie un ordre de traitement à **Redis**.
4. Le backend répond immédiatement au frontend que la demande est prise en compte, libérant ainsi l'utilisateur.
5. En arrière-plan, le **Celery Worker** récupère l'ordre depuis **Redis**, se connecte aux bases externes, génère le rapport, et met à jour le statut final dans **PostgreSQL**.
6. En parallèle, **Celery Beat** surveille la base de données et déclenche de lui-même ce même workflow lorsqu'une planification arrive à échéance.
