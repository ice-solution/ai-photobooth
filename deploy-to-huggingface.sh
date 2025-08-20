#!/bin/bash

# 🚀 Hugging Face FaceDancer 快速部署腳本

echo "🎭 FaceDancer Hugging Face 部署腳本"
echo "=================================="

# 檢查必要檔案
echo "📋 檢查必要檔案..."

required_files=(
    "huggingface-deployment/app.py"
    "huggingface-deployment/api.py"
    "huggingface-deployment/requirements.txt"
    "huggingface-deployment/README.md"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 缺少檔案: $file"
        exit 1
    fi
done

echo "✅ 所有必要檔案都存在"

# 提示用戶輸入資訊
echo ""
echo "🔧 請輸入以下資訊："
read -p "你的 Hugging Face 用戶名: " username
read -p "Space 名稱 (預設: facedancer-ai): " space_name
space_name=${space_name:-facedancer-ai}

echo ""
echo "📝 部署資訊："
echo "用戶名: $username"
echo "Space 名稱: $space_name"
echo "Space URL: https://$username-$space_name.hf.space"

# 創建部署目錄
echo ""
echo "📁 創建部署目錄..."
deploy_dir="huggingface-deployment"
if [ ! -d "$deploy_dir" ]; then
    mkdir -p "$deploy_dir"
fi

# 複製檔案到部署目錄
echo "📋 複製檔案..."
cp huggingface-deployment/app.py "$deploy_dir/"
cp huggingface-deployment/api.py "$deploy_dir/"
cp huggingface-deployment/requirements.txt "$deploy_dir/"
cp huggingface-deployment/README.md "$deploy_dir/"

# 創建 .gitignore
echo "📝 創建 .gitignore..."
cat > "$deploy_dir/.gitignore" << EOF
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis
EOF

# 創建部署說明
echo "📖 創建部署說明..."
cat > "$deploy_dir/DEPLOYMENT_STEPS.md" << EOF
# 🚀 部署步驟

## 1. 創建 Hugging Face Space

1. 訪問 https://huggingface.co/spaces
2. 點擊 "Create new Space"
3. 設定：
   - Owner: $username
   - Space name: $space_name
   - Space SDK: Gradio
   - Space hardware: CPU (免費) 或 GPU (付費)
   - License: MIT

## 2. 上傳檔案

將此目錄中的所有檔案上傳到你的 Space。

## 3. 設定環境變數

在 Space 設定中添加：
- GRADIO_SERVER_NAME: 0.0.0.0
- GRADIO_SERVER_PORT: 7860

## 4. 等待部署

部署完成後，你的服務將在以下 URL 可用：
- Web 介面: https://$username-$space_name.hf.space
- API 端點: https://$username-$space_name.hf.space/swap
- 健康檢查: https://$username-$space_name.hf.space/health

## 5. 更新你的程式

在 config.env 中添加：
\`\`\`env
HUGGINGFACE_SPACES_URL=https://$username-$space_name.hf.space
\`\`\`

在 facedancer-integration.js 中更新 URL：
\`\`\`javascript
const response = await axios.post('https://$username-$space_name.hf.space/swap', formData, {
  // ...
});
\`\`\`
EOF

echo ""
echo "✅ 部署檔案準備完成！"
echo ""
echo "📁 部署檔案位置: $deploy_dir/"
echo ""
echo "🚀 下一步："
echo "1. 訪問 https://huggingface.co/spaces"
echo "2. 創建新的 Space"
echo "3. 上傳 $deploy_dir/ 目錄中的所有檔案"
echo "4. 等待部署完成"
echo ""
echo "📖 詳細步驟請查看: $deploy_dir/DEPLOYMENT_STEPS.md"
echo ""
echo "🎉 部署完成後，你的 FaceDancer 服務將可以通過以下 URL 訪問："
echo "   https://$username-$space_name.hf.space"
