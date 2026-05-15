@echo off
echo ============================================
echo  CELLHAWK — Copyright Updater
echo  Pushes: index.html + this bat file
echo ============================================
echo.

echo [1/3] Updating copyright in index.html...
powershell -Command "(Get-Content 'index.html') -replace '(?:&copy;|©)\s*\d{4}\s*[^<.]*', '© 2026 Shashank Kumar' | Set-Content 'index.html'"

echo [2/3] Staging files...
git add index.html remove_copyright.bat

git diff --cached --quiet
if %errorlevel% == 0 (
    echo Nothing new to commit. Already up-to-date.
) else (
    git commit -m "chore: update copyright to Shashank Kumar"
    echo [3/3] Pushing to GitHub...
    git push
)

echo.
echo ============================================
echo  DONE.
echo ============================================
pause
