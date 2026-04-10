@echo off
echo Starting FastReport Services...

:: 0. Start Portable Redis
start /min "FastReport Redis" cmd /k "cd redis_portable && redis-server.exe"

:: 1. Start Django Server
start /min "FastReport Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

:: 2. Start Celery Worker
start /min "FastReport Celery Worker" cmd /k "cd backend && venv\Scripts\activate && celery -A config worker -l INFO --pool=solo"

:: 3. Start Celery Beat
start /min "FastReport Celery Beat" cmd /k "cd backend && venv\Scripts\activate && celery -A config beat -l INFO"

:: 4. Start Frontend
start /min "FastReport Frontend" cmd /k "set PATH=%PATH%;C:\Program Files\nodejs && cd frontend && npm run preview"

echo All services started!
timeout /t 5
