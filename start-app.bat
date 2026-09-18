@echo off
REM Double-click this file on Windows to install dependencies (first run only)
REM and start the TrekTaiwan Expo dev server.
cd /d "%~dp0"

echo ==============================
echo  TrekTaiwan 啟動中...
echo ==============================

if not exist "node_modules" (
  echo 首次執行，安裝套件中，請稍候...
  call npm install
)

echo.
echo 即將啟動開發伺服器。
echo 啟動後請用手機安裝 Expo Go App，掃描畫面上出現的 QR Code。
echo.

call npx expo start

pause
