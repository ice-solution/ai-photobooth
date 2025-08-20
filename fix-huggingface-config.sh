#!/bin/bash

# 🔧 Hugging Face 配置修正腳本

echo "🔧 修正 Hugging Face Spaces 配置"
echo "================================"

# 檢查並修正 README.md
echo "📝 檢查 README.md 配置..."

if ! grep -q "title:" huggingface-deployment/README.md; then
    echo "❌ README.md 缺少 YAML 配置，正在修正..."
    
    # 備份原始檔案
    cp huggingface-deployment/README.md huggingface-deployment/README.md.backup
    
    # 添加 YAML 配置
    cat > huggingface-deployment/README.md << 'EOF'
---
title: FaceDancer AI 臉部交換
emoji: 🎭
colorFrom: purple
colorTo: pink
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
---

# 🎭 FaceDancer - AI 臉部交換

基於 [FaceDancer](https://github.com/felixrosberg/FaceDancer) 的高品質臉部交換 AI 模型。

## 🚀 功能特色

- **高品質臉部交換**: 支援姿勢和遮擋感知
- **簡單易用**: 只需上傳兩張圖片即可
- **即時處理**: 快速生成結果
- **Web 介面**: 友好的 Gradio 介面

## 📋 使用方法

1. **上傳源臉部圖片**: 包含要交換的臉部
2. **上傳目標圖片**: 要進行臉部交換的目標圖片
3. **點擊開始臉部交換**: AI 將自動處理
4. **查看結果**: 在右側查看臉部交換結果

## 🔧 技術架構

- **框架**: Gradio
- **AI 模型**: FaceDancer
- **圖片處理**: OpenCV, PIL
- **深度學習**: PyTorch

## 📝 注意事項

- 確保臉部圖片清晰可見
- 建議使用正面臉部照片
- 處理時間約 10-30 秒
- 請負責任地使用此技術

## 🔗 相關連結

- [FaceDancer GitHub](https://github.com/felixrosberg/FaceDancer)
- [論文](https://openaccess.thecvf.com/content/WACV2023/papers/Rosberg_FaceDancer_Pose-_and_Occlusion-Aware_High_Fidelity_Face_Swapping_WACV_2023_paper.pdf)

---

**注意**: 請確保遵守相關的使用條款和隱私政策。
EOF
    
    echo "✅ README.md 配置已修正"
else
    echo "✅ README.md 配置正確"
fi

# 檢查並修正 requirements.txt
echo "📦 檢查 requirements.txt..."

if ! grep -q "gradio" huggingface-deployment/requirements.txt; then
    echo "❌ requirements.txt 缺少必要依賴，正在修正..."
    
    cat > huggingface-deployment/requirements.txt << 'EOF'
gradio>=4.0.0
torch>=2.0.0
torchvision>=0.15.0
Pillow>=9.0.0
numpy>=1.21.0
opencv-python>=4.5.0
requests>=2.25.0
transformers>=4.20.0
accelerate>=0.20.0
fastapi>=0.100.0
uvicorn>=0.20.0
python-multipart>=0.0.6
EOF
    
    echo "✅ requirements.txt 已修正"
else
    echo "✅ requirements.txt 配置正確"
fi

# 檢查 app.py
echo "🐍 檢查 app.py..."

if [ ! -f "huggingface-deployment/app.py" ]; then
    echo "❌ app.py 不存在"
    exit 1
else
    echo "✅ app.py 存在"
fi

# 檢查 api.py
echo "🔌 檢查 api.py..."

if [ ! -f "huggingface-deployment/api.py" ]; then
    echo "❌ api.py 不存在"
    exit 1
else
    echo "✅ api.py 存在"
fi

# 更新 config.env
echo "⚙️ 更新 config.env..."

# 獲取用戶名和 Space 名稱
read -p "請輸入你的 Hugging Face 用戶名: " username
read -p "請輸入你的 Space 名稱: " space_name

# 更新 config.env
sed -i.bak "s|HUGGINGFACE_SPACES_URL=.*|HUGGINGFACE_SPACES_URL=https://${username}-${space_name}.hf.space|" config.env

echo "✅ config.env 已更新"

echo ""
echo "🎉 配置修正完成！"
echo ""
echo "📋 下一步："
echo "1. 重新上傳以下檔案到你的 Hugging Face Space："
echo "   - huggingface-deployment/README.md"
echo "   - huggingface-deployment/requirements.txt"
echo "   - huggingface-deployment/app.py"
echo "   - huggingface-deployment/api.py"
echo ""
echo "2. 等待部署完成 (約 5-10 分鐘)"
echo ""
echo "3. 測試你的 Space："
echo "   https://${username}-${space_name}.hf.space"
echo ""
echo "4. 在你的程式中測試："
echo "   npm start"
