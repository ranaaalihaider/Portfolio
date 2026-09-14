@echo off
echo ========================================================
echo GitHub Automatic Repo Creator and Uploader
echo ========================================================
echo.
echo IMPORTANT: This script requires the GitHub CLI (gh) to be installed and authenticated.
echo You can download it from: https://cli.github.com/
echo After installing, run 'gh auth login' in your command prompt.
echo.
pause

set "PROJECTS_DIR=C:\Users\ranaa\OneDrive\Desktop\Portfolio\Projects"
set "GITHUB_USER=ranaaalihaider"

for /d %%D in ("%PROJECTS_DIR%\*") do (
    echo.
    echo Processing project: %%~nxD
    cd "%%D"
    
    :: Initialize git if not already initialized
    if not exist ".git" (
        git init
    )
    
    :: Add and commit all files
    git add .
    git commit -m "Initial commit"
    git branch -M main
    
    :: Create the repository on GitHub and push (ignores if repo already exists)
    gh repo create "%GITHUB_USER%/%%~nxD" --public --source=. --remote=origin --push
    
    echo Done pushing %%~nxD!
)

echo.
echo All projects processed!
pause
