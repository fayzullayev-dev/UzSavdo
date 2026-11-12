@echo off
title UzSavdo Auto-Start Servers
echo ===================================================
echo   UzSavdo: Ishga tushirish (API + Web + Tunnel)
echo ===================================================
cd /d "E:\UzSavdo"

start "UzSavdo-API" cmd /k "node apps\api\dist\src\main.js"
timeout /t 3 /nobreak >nul

start "UzSavdo-Web" cmd /k "cd apps\web && npx next start -p 3000"
timeout /t 3 /nobreak >nul

start "UzSavdo-Tunnel" cmd /k "cloudflared.exe tunnel --url http://localhost:3000"

echo.
echo Barcha serverlar va ommaviy havola muvaffaqiyatli ishga tushirildi!
echo Ushbu oynani yopishingiz mumkin.
timeout /t 5 >nul
exit
