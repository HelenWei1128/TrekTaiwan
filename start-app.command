#!/bin/bash
# Double-click this file on macOS to install dependencies (first run only)
# and start the TrekTaiwan Expo dev server.
cd "$(dirname "$0")"

echo "=============================="
echo " TrekTaiwan 啟動中..."
echo "=============================="

if [ ! -d "node_modules" ]; then
  echo "首次執行，安裝套件中，請稍候..."
  npm install
fi

echo ""
echo "即將啟動開發伺服器。"
echo "啟動後請用手機安裝 Expo Go App，掃描畫面上出現的 QR Code。"
echo ""

npx expo start

echo ""
read -p "按下 Enter 鍵關閉視窗..."
