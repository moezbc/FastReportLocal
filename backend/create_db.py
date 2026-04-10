import psycopg2
import os
from dotenv import load_dotenv
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Load .env
load_dotenv()

user = os.getenv('POSTGRES_USER', 'postgres')
password = os.getenv('POSTGRES_PASSWORD', 'password')
host = os.getenv('POSTGRES_HOST', 'localhost')
port = os.getenv('POSTGRES_PORT', '5432')
dbname = "fastreport"

print(f"Connexion à 'postgres' pour créer '{dbname}'...")

try:
    conn = psycopg2.connect(
        dbname="postgres",
        user=user,
        password=password,
        host=host,
        port=port
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    
    # Check if exists
    cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{dbname}'")
    exists = cur.fetchone()
    
    if not exists:
        print(f"Création de la base de données '{dbname}'...")
        cur.execute(f"CREATE DATABASE {dbname}")
        print("Succès !")
    else:
        print(f"La base de données '{dbname}' existe déjà.")
        
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"Erreur : {e}")
