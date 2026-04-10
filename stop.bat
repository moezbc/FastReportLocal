@echo off
echo Stopping FastReport Services...

:: Kill Redis Server
taskkill /F /IM redis-server.exe >nul 2>&1
echo Redis stopped.

:: Kill Python Processes (Django & Celery)
:: WARNING: This kills ALL python processes. If you run other python apps, use with caution.
:: For better precision, we could filter by window title if they weren't minimized/hidden differently.
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM celery.exe >nul 2>&1
echo Backend & Celery stopped.

:: Kill Node.js (Frontend)
taskkill /F /IM node.exe >nul 2>&1
echo Frontend stopped.

:: Kill CMD windows with specific titles
taskkill /F /FI "WINDOWTITLE eq FastReport*" >nul 2>&1

echo All services stopped!
pause
