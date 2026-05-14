@echo off
echo [1/3] Removing deploy_to_github.bat from repo...
git rm deploy_to_github.bat

echo [2/3] Committing the change...
git commit -m "Remove deployment script"

echo [3/3] Pushing to GitHub...
git push

echo.
echo DONE! The script is removed from GitHub.
pause
