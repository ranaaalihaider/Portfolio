@echo off
echo ========================================
echo Git Auto-Push Script
echo ========================================

:: Initialize git if it isn't already
git init

:: Add the remote repository (ignores error if it already exists)
git remote add origin https://github.com/ranaaalihaider/Portfolio.git 2>nul

:: Add all changes
echo.
echo Adding changes...
git add .

:: Prompt for commit message
echo.
set /p msg="Enter commit message (or press enter for default): "
if "%msg%"=="" set msg="Auto-update: %date% %time%"

:: Commit changes
echo.
echo Committing...
git commit -m "%msg%"

:: Make sure branch is main
git branch -M main

:: Push to GitHub
echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Done!
echo ========================================
pause
