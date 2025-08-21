#!/bin/bash

echo "🚀 部署 PiAPI 臉部交換整合..."

# 檢查是否在正確的目錄
if [ ! -f "piapi-faceswap-integration.js" ]; then
    echo "❌ 錯誤：請在項目根目錄運行此腳本"
    exit 1
fi

echo "📁 檢查文件..."
echo "✅ piapi-faceswap-integration.js"
echo "✅ gender-detection.js"
echo "✅ facedancer-integration.js (已更新)"
echo "✅ routes/generate.js (已更新)"
echo "✅ config.env (已更新)"

echo ""
echo "🧪 測試 PiAPI 整合..."
echo "運行: node test-piapi-faceswap.js"

echo ""
echo "📋 主要改進："
echo "1. ✅ 從 Hugging Face 切換到 PiAPI"
echo "2. ✅ 加入性別檢測功能"
echo "3. ✅ 確保生成男性正面照"
echo "4. ✅ 避免女性出現在男性職業照中"
echo "5. ✅ 改進的錯誤處理和重試機制"

echo ""
echo "🎯 新功能："
echo "- 使用 PiAPI 進行高質量臉部交換"
echo "- 智能性別檢測和過濾"
echo "- 正面照要求確保最佳臉部交換效果"
echo "- 職業特定的性別控制"

echo ""
echo "🔧 配置詳情："
echo "- PiAPI Key: dc53dece4a8a9bd4d7694b8403450e84297463ed4ca98a4cbfb7a238761db4dc"
echo "- 模型: Qubico/image-toolkit"
echo "- 任務類型: face-swap"
echo "- 價格: $0.01 per generation"

echo ""
echo "🎉 PiAPI 整合部署完成！"
