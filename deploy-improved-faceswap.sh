#!/bin/bash

echo "🚀 部署改進版臉部交換到 Hugging Face Space..."

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
echo "📋 改進內容："
echo "1. ✅ 智能臉部區域檢測和定位"
echo "2. ✅ 更自然的橢圓形遮罩"
echo "3. ✅ 顏色匹配和調整"
echo "4. ✅ 智能源臉部裁剪"
echo "5. ✅ 最終銳化和對比度調整"
echo ""
echo "📋 下一步手動操作："
echo "1. 訪問 https://huggingface.co/spaces/keithskk321/ice-solution-faceswap"
echo "2. 點擊 'Files' 標籤"
echo "3. 上傳更新後的 app.py 文件"
echo ""
echo "4. 等待部署完成（約 2-3 分鐘）"
echo "5. 測試改進效果："
echo "   - 運行: node test-real-faceswap.js"
echo "   - 檢查生成的結果圖片"
echo ""
echo "🎯 改進後的臉部交換應該有更好的效果！"
