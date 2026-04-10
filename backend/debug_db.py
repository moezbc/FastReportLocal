import psycopg2
import os
from dotenv import load_dotenv
import sys

# Load .env variables
load_dotenv()

dbname = os.getenv('POSTGRES_DB', 'fastreport')
user = os.getenv('POSTGRES_USER', 'postgres')
password = os.getenv('POSTGRES_PASSWORD', 'password')
host = os.getenv('POSTGRES_HOST', 'localhost')
port = os.getenv('POSTGRES_PORT', '5432')

print(f"Tentative de connexion à PostgreSQL...")
print(f"Hôte: {host}:{port}")
print(f"Utilisateur: {user}")
print(f"Base de données cible: {dbname}")
print("-" * 30)

# 1. Test connection to server (without DB)
print("1. Test de connexion au serveur PostgreSQL (sans base spécifique)...")
try:
    conn = psycopg2.connect(
        dbname="postgres",
        user=user,
        password=password,
        host=host,
        port=port
    )
    print("   [OK] Connexion au serveur réussie !")
    conn.close()
except psycopg2.OperationalError as e:
    err = str(e)
    print("   [ERREUR] Impossible de se connecter au serveur.")
    if "password authentication failed" in err:
        print("   -> MOT DE PASSE INCORRECT pour l'utilisateur '" + user + "'.")
        print("   -> Veuillez vérifier le fichier .env")
    elif "Connection refused" in err:
        print("   -> Le serveur PostgreSQL ne semble pas démarré ou n'écoute pas sur le port " + port)
    else:
        print(f"   -> Détails : {err}")
    sys.exit(1)

# 2. Test existence of database
print("\n2. Vérification de l'existence de la base de données '" + dbname + "'...")
try:
    conn = psycopg2.connect(
        dbname=dbname,
        user=user,
        password=password,
        host=host,
        port=port
    )
    print("   [OK] La base de données existe et est accessible !")
    conn.close()
except psycopg2.OperationalError as e:
    err = str(e)
    if 'database "' + dbname + '" does not exist' in err:
        print("   [ATTENTION] La base de données '" + dbname + "' N'EXISTE PAS.")
        print("   -> Tentative de création...")
        try:
            # Connect to 'postgres' db to create new db
            conn = psycopg2.connect(
                dbname="postgres",
                user=user,
                password=password,
                host=host,
                port=port
            )
            conn.autocommit = True
            cur = conn.cursor()
            cur.execute(f"CREATE DATABASE {dbname};")
            cur.close()
            conn.close()
            print("   [SUCCÈS] Base de données créée avec succès !")
        except Exception as create_err:
            print(f"   [ECHEC] Impossible de créer la base : {create_err}")
            print("   -> Vous devez la créer manuellement via pgAdmin ou la ligne de commande.")
    else:
        print(f"   [ERREUR] Erreur de connexion à la base : {err}")
