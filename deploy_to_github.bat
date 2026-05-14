@echo off
echo ==============================================
echo CELLHAWK OS - GitHub Deployment Script
echo ==============================================
echo.

echo [1/4] Initializing Git Repository...
git init

echo [2/4] Adding all files...
git add .

echo [3/4] Committing files...
git commit -m "Initial commit: Production release of CELLHAWK M&A Architecture"

echo [4/4] Pushing to GitHub...
git branch -M main
git remote add origin https://github.com/sidthebuilder/cellhawk.git
git push -u origin main

echo.
echo ==============================================
echo DEPLOYMENT COMPLETE!
echo ==============================================
echo To make the site live:
echo 1. Go to https://github.com/sidthebuilder/cellhawk/settings/pages
echo 2. Under 'Source', select 'Deploy from a branch'
echo 3. Select 'main' branch and / (root) folder
echo 4. Click Save!
echo ==============================================
pause
