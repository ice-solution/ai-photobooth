#!/bin/bash

echo "🚀 生產環境部署腳本"
echo "=================="

# 檢查環境
echo "🔧 檢查環境..."

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝"
    exit 1
fi

# 檢查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安裝"
    exit 1
fi

echo "✅ 環境檢查完成"

# 後端部署
echo ""
echo "🔧 後端部署..."

# 安裝依賴
echo "📦 安裝後端依賴..."
npm install

# 檢查 MongoDB 連接
echo "🗄️ 檢查 MongoDB 連接..."
if ! node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/ai-photobooth').then(() => { console.log('MongoDB 連接成功'); process.exit(0); }).catch(err => { console.log('MongoDB 連接失敗:', err.message); process.exit(1); });" 2>/dev/null; then
    echo "⚠️ MongoDB 連接失敗，請確保 MongoDB 正在運行"
fi

# 檢查環境變數
echo "⚙️ 檢查環境變數..."
if [ ! -f "config.env" ]; then
    echo "❌ config.env 檔案不存在"
    exit 1
fi

echo "✅ 後端部署準備完成"

# 前端部署
echo ""
echo "🔧 前端部署..."

# 進入前端目錄
cd client

# 安裝依賴
echo "📦 安裝前端依賴..."
npm install

# 設置生產環境
echo "🏭 設置生產環境..."
export NODE_ENV=production

# 構建前端
echo "🔨 構建前端..."
npm run build

# 檢查構建結果
if [ ! -d "build" ]; then
    echo "❌ 前端構建失敗"
    exit 1
fi

echo "✅ 前端構建完成"

# 返回根目錄
cd ..

# 創建部署配置
echo ""
echo "📋 創建部署配置..."

# 創建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ai-photobooth-api',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      }
    }
  ]
};
EOF

# 創建 Nginx 配置
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name photobooth-api.ice-solution.hk;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name photobooth-api.ice-solution.hk;
    
    # SSL 配置 (需要你的 SSL 證書)
    ssl_certificate /path/to/your/ssl/certificate.crt;
    ssl_certificate_key /path/to/your/ssl/private.key;
    
    # 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # API 路由
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 靜態檔案
    location / {
        root /path/to/your/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # 快取配置
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # 上傳檔案大小限制
    client_max_body_size 10M;
}
EOF

echo ""
echo "🎉 部署配置完成！"
echo ""
echo "📋 部署步驟："
echo "1. 將 nginx.conf 複製到你的 Nginx 配置目錄"
echo "2. 更新 SSL 證書路徑"
echo "3. 將前端 build 目錄部署到伺服器"
echo "4. 使用 PM2 啟動後端服務："
echo "   pm2 start ecosystem.config.js --env production"
echo ""
echo "🔗 服務地址："
echo "- API: https://photobooth-api.ice-solution.hk"
echo "- 前端: https://photobooth.ice-solution.hk"
echo ""
echo "📖 詳細說明："
echo "- Nginx 配置: nginx.conf"
echo "- PM2 配置: ecosystem.config.js"
echo "- 前端構建: client/build/"
