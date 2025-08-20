#!/bin/bash

echo "🐍 安裝 Python 依賴..."
echo "======================"

# 檢查 Python 版本
python3 --version

# 安裝必要的 Python 套件
echo "📦 安裝 FastAPI 和相關依賴..."
pip3 install fastapi uvicorn python-multipart

echo "📦 安裝圖片處理依賴..."
pip3 install Pillow opencv-python numpy

echo "📦 安裝機器學習依賴..."
pip3 install torch torchvision

echo "📦 安裝其他依賴..."
pip3 install requests

echo ""
echo "✅ Python 依賴安裝完成！"
echo ""
echo "🚀 現在可以啟動自建服務："
echo "python3 facedancer-server.py"
