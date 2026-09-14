@echo off
echo ==============================================
echo       Transport System - GitHub Push
echo ==============================================

:: Check if git is initialized
if not exist .git (
    echo Git is not initialized! Initializing now...
    git init
    echo.
    echo NOTE: Please ensure you have added a remote origin.
    echo E.g.: git remote add origin https://github.com/yourusername/your-repo.git
    echo.
)

:: Prompt for commit message
set /p commitMsg="Enter commit message (or press enter for default 'Update'): "

:: Set default message if empty
if "%commitMsg%"=="" set commitMsg=Update %date% %time%

echo.
echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "%commitMsg%"

echo.
echo Pushing to GitHub (main branch)...
:: Automatically push to main branch (or master). If the upstream isn't set, it will set it.
git push -u origin main || git push -u origin master

echo.
echo Done! If push was successful, GitHub Actions will now deploy to Hostinger.
pause
