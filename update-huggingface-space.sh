#!/bin/bash

echo "🚀 更新 Hugging Face Space 部署..."

# 檢查是否在正確的目錄
if [ ! -f "huggingface-deployment/app.py" ]; then
    echo "❌ 錯誤：請在項目根目錄運行此腳本"
    exit 1
fi

echo "📁 準備部署文件..."

# 確保 uploads 目錄存在
mkdir -p uploads

echo "✅ 部署文件已準備完成"
echo ""
echo "📋 下一步手動操作："
echo "1. 訪問 https://huggingface.co/spaces/keithskk321/ice-solution-faceswap"
echo "2. 點擊 'Files' 標籤"
echo "3. 上傳以下文件："
echo "   - huggingface-deployment/app.py"
echo "   - huggingface-deployment/requirements.txt"
echo "   - huggingface-deployment/README.md"
echo ""
echo "4. 等待部署完成（約 2-3 分鐘）"
echo "5. 測試 API 端點："
echo "   - 健康檢查: https://keithskk321-ice-solution-faceswap.hf.space/health"
echo "   - 臉部交換: https://keithskk321-ice-solution-faceswap.hf.space/swap"
echo ""
echo "🎯 更新完成後，你的應用將使用 Hugging Face Space 進行臉部交換！"
