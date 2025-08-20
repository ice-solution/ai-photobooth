#!/bin/bash

echo "🐍 設置 Python 虛擬環境..."
echo "=========================="

# 創建虛擬環境
echo "📁 創建虛擬環境..."
python3 -m venv venv

# 激活虛擬環境
echo "🔧 激活虛擬環境..."
source venv/bin/activate

# 升級 pip
echo "⬆️ 升級 pip..."
pip install --upgrade pip

# 安裝依賴
echo "📦 安裝 FastAPI 和相關依賴..."
pip install fastapi uvicorn python-multipart

echo "📦 安裝圖片處理依賴..."
pip install Pillow opencv-python numpy

echo "📦 安裝機器學習依賴..."
pip install torch torchvision

echo "📦 安裝其他依賴..."
pip install requests

echo ""
echo "✅ Python 虛擬環境設置完成！"
echo ""
echo "🚀 使用方法："
echo "1. 激活虛擬環境: source venv/bin/activate"
echo "2. 啟動自建服務: python facedancer-server.py"
echo "3. 退出虛擬環境: deactivate"
echo ""
echo "📋 或者直接運行："
echo "./venv/bin/python facedancer-server.py"
