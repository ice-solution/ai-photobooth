#!/bin/bash

echo "🚀 重新部署臉部交換改進功能"
echo "============================"

# 停止現有服務
echo "🛑 停止現有服務..."
pkill -f "facedancer-server.py" 2>/dev/null || true
pkill -f "node server.js" 2>/dev/null || true

# 等待服務停止
sleep 2

# 檢查並修正檔案
echo "🔧 檢查並修正檔案..."

# 1. 檢查 config.env
if ! grep -q "FACEDANCER_API_URL=http://localhost:8000" config.env; then
    echo "📝 更新 config.env..."
    echo "FACEDANCER_API_URL=http://localhost:8000" >> config.env
fi

# 2. 檢查 Python 虛擬環境
if [ ! -d "venv" ]; then
    echo "🐍 創建 Python 虛擬環境..."
    ./setup-python-env.sh
fi

# 3. 啟動自建 FaceDancer 服務
echo "🚀 啟動自建 FaceDancer 服務..."
./venv/bin/python facedancer-server.py &
FACEDANCER_PID=$!

# 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 5

# 檢查服務狀態
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ 自建 FaceDancer 服務啟動成功"
else
    echo "⚠️ 自建服務啟動失敗，將使用備用方案"
fi

# 4. 啟動 Node.js 服務
echo "🚀 啟動 Node.js 服務..."
npm start &
NODE_PID=$!

# 等待服務啟動
sleep 3

echo ""
echo "🎉 重新部署完成！"
echo ""
echo "📊 服務狀態："
echo "- 自建 FaceDancer 服務: http://localhost:8000"
echo "- Node.js 後端服務: http://localhost:5001"
echo "- 前端服務: http://localhost:3000"
echo ""
echo "🧪 測試臉部交換："
echo "1. 訪問 http://localhost:3000"
echo "2. 上傳用戶照片和 AI 生成照片"
echo "3. 測試改進的臉部交換效果"
echo ""
echo "📋 改進功能："
echo "- ✅ 智能臉部定位"
echo "- ✅ 橢圓形遮罩邊緣模糊"
echo "- ✅ 顏色平衡調整"
echo "- ✅ 多層次備用服務"
echo ""
echo "🔧 故障排除："
echo "- 如果臉部交換失敗，檢查日誌"
echo "- 確保圖片清晰且正面"
echo "- 檢查服務是否正常運行"
echo ""
echo "📖 詳細說明：FACESWAP_IMPROVEMENTS.md"
