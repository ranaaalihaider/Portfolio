@echo off
echo Starting Hajj Transport ERP...

:: Start the Vite development server for CSS/JS in a separate window
start "Vite Dev Server" cmd /c "npm run dev"

:: Start the Laravel development server in a separate window
start "Laravel Server" cmd /c "php artisan serve"

:: Wait for 3 seconds to give the server time to start
timeout /t 3 /nobreak > NUL

:: Launch Google Chrome to the application URL
start chrome "http://127.0.0.1:8000"

echo ERP Launched!
