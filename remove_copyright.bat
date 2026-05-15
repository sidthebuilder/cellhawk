@echo off
echo ============================================
echo  CELLHAWK — Copyright Updater
echo  Sets: (C) 2026 Shashank Kumar
echo ============================================
echo.

echo [1/5] Updating copyright in index.html...
powershell -Command "(Get-Content 'index.html') -replace '(?:&copy;|©)\s*\d{4}\s*[^<.]*', '© 2026 Shashank Kumar' | Set-Content 'index.html'"

echo [2/5] Updating copyright in README.md...
powershell -Command "(Get-Content 'README.md') -replace '©\s*\d{4}\s*[^.*]*', '© 2026 Shashank Kumar' | Set-Content 'README.md'"

echo [3/5] Updating copyright in DATA_ROOM docs...
powershell -Command "Get-ChildItem 'DATA_ROOM\*.md' | ForEach-Object { (Get-Content $_.FullName) -replace '©\s*\d{4}\s*LOT Aerospace[^.]*', '© 2026 Shashank Kumar' | Set-Content $_.FullName }"

echo [4/5] Committing changes to Git...
git add .
git commit -m "chore: update copyright to Shashank Kumar (individual ownership)"

echo [5/5] Pushing to GitHub...
git push

echo.
echo ============================================
echo  DONE. All files updated and pushed.
echo  Copyright: (C) 2026 Shashank Kumar
echo ============================================
pause
