#!/bin/bash
echo "=============================================="
echo "Import de la base de donnees vers FastReport"
echo "=============================================="

# On verifie que le fichier sql est bien present
if [ ! -f "export_fastreport.sql" ]; then
    echo "ERREUR : Le fichier export_fastreport.sql est introuvable."
    echo "Veuillez placer ce fichier dans le meme dossier que ce script."
    exit 1
fi

echo "Importation en cours vers le conteneur n8n-postgres..."
# On utilise l'utilisateur 'n8n' et la base 'fastreport' que nous avons cree precedemment
cat export_fastreport.sql | docker exec -i n8n-postgres psql -U n8n -d fastreport

echo ""
echo "Termine ! L'import de la base de donnees est reussi."
