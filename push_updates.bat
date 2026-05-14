@echo off
echo [1/3] Adding changes...
git add .

echo [2/3] Committing updates...
git commit -m "Update footer and README formatting"

echo [3/3] Pushing to GitHub...
git push

echo.
echo DONE! Everything is updated on GitHub.
pause
