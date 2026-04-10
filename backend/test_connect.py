import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

user = os.getenv('POSTGRES_USER', 'postgres')
password = os.getenv('POSTGRES_PASSWORD', 'password')
host = os.getenv('POSTGRES_HOST', 'localhost')
port = os.getenv('POSTGRES_PORT', '5432')
dbname = "fastreport"

print(f"Tentative de connexion à '{dbname}'...")
print(f"User: {user}")

try:
    conn = psycopg2.connect(
        dbname=dbname,
        user=user,
        password=password,
        host=host,
        port=port
    )
    print("Connexion RÉUSSIE !")
    conn.close()
except Exception as e:
    print(f"ECHEC de connexion : {e}")
