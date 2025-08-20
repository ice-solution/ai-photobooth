# AI 志願職業照生成器 - 設定指南

## 🚀 快速開始

### 1. 環境需求
- Node.js 16+
- MongoDB 4.4+
- OpenAI API 金鑰
- Stability AI API 金鑰

### 2. 安裝依賴
```bash
# 安裝後端依賴
npm install

# 安裝前端依賴
cd client && npm install && cd ..
```

### 3. 環境設定

#### 3.1 複製環境變數檔案
```bash
cp config.env .env
```

#### 3.2 設定 API 金鑰

編輯 `.env` 檔案，填入你的 API 金鑰：

```env
# Stability AI API 設定
STABILITY_API_KEY=sk-Ox64fg4veP7SR8sr7AKoejHGxQapCfEWa7f5SEJvYKyj0nE4
STABILITY_API_URL=https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image

# MongoDB 設定
MONGODB_URI=mongodb://localhost:27017/ai-photobooth

# OpenAI API (用於語音轉文字和職業驗證)
OPENAI_API_KEY=your_openai_api_key_here

# 伺服器設定
PORT=5001
NODE_ENV=development

# 檔案上傳設定
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

#### 3.3 獲取 API 金鑰

**OpenAI API 金鑰:**
1. 訪問 https://platform.openai.com/
2. 註冊或登入帳戶
3. 前往 API Keys 頁面
4. 創建新的 API 金鑰
5. 複製金鑰並填入 `OPENAI_API_KEY`

**Stability AI API 金鑰:**
1. 訪問 https://platform.stability.ai/
2. 註冊或登入帳戶
3. 前往 API Keys 頁面
4. 創建新的 API 金鑰
5. 複製金鑰並填入 `STABILITY_API_KEY`

### 4. 啟動 MongoDB

#### macOS (使用 Homebrew)
```bash
brew services start mongodb-community
```

#### Windows
```bash
net start MongoDB
```

#### Linux
```bash
sudo systemctl start mongod
```

### 5. 啟動應用程式

#### 開發模式 (同時啟動前後端)
```bash
npm run dev
```

#### 分別啟動
```bash
# 後端
npm start

# 前端 (新終端)
npm run client
```

### 6. 訪問應用程式

開啟瀏覽器訪問：http://localhost:3000

## 🔧 功能測試

### 測試 API 連接
```bash
node test-api.js
```

### 手動測試端點
```bash
# 健康檢查
curl http://localhost:5001/api/health

# 職業驗證
curl -X POST http://localhost:5001/api/profession/validate \
  -H "Content-Type: application/json" \
  -d '{"text":"我想當醫生","sessionId":"test_123"}'
```

## 📱 使用流程

1. **語音錄製**: 對著麥克風說出你的夢想職業
2. **文字確認**: 確認語音轉文字結果，必要時可編輯
3. **職業驗證**: 系統驗證職業是否合法合理
4. **拍照**: 拍攝一張清晰的正面照片
5. **AI 生成**: 等待 AI 生成職業照
6. **臉部交換**: AI 將你的臉部特徵融入職業照
7. **下載分享**: 下載最終結果或分享給朋友

## 🎨 支援的職業

系統支援多種職業，包括但不限於：
- 醫生、護士、教師、律師
- 工程師、設計師、會計師、建築師
- 警察、消防員、軍人、飛行員
- 廚師、攝影師、藝術家、音樂家
- 演員、運動員、科學家、記者
- 以及更多專業職業...

## 🐛 故障排除

### 常見問題

1. **MongoDB 連接失敗**
   ```bash
   # 檢查 MongoDB 狀態
   brew services list | grep mongodb
   
   # 重新啟動 MongoDB
   brew services restart mongodb-community
   ```

2. **API 金鑰錯誤**
   - 確認 API 金鑰是否正確
   - 檢查 API 金鑰是否有足夠的額度
   - 確認 API 金鑰是否已啟用

3. **Port 被佔用**
   ```bash
   # 檢查 port 使用情況
   lsof -i :5001
   lsof -i :3000
   
   # 修改 config.env 中的 PORT 設定
   ```

4. **前端無法連接後端**
   - 確認後端服務正在運行
   - 檢查 client/package.json 中的 proxy 設定
   - 確認 CORS 設定正確

### 日誌查看
```bash
# 查看後端日誌
npm start

# 查看前端日誌
cd client && npm start
```

## 📊 監控和維護

### 檢查服務狀態
```bash
# 檢查後端
curl http://localhost:5001/api/health

# 檢查前端
curl http://localhost:3000
```

### 清理快取
```bash
# 清理 node_modules
rm -rf node_modules package-lock.json
npm install

# 清理前端快取
cd client
rm -rf node_modules package-lock.json
npm install
```

## 🔒 安全注意事項

1. **API 金鑰安全**
   - 不要將 API 金鑰提交到版本控制
   - 使用環境變數管理敏感資訊
   - 定期輪換 API 金鑰

2. **檔案上傳安全**
   - 限制上傳檔案大小
   - 驗證檔案類型
   - 定期清理上傳目錄

3. **資料庫安全**
   - 使用強密碼
   - 限制資料庫訪問權限
   - 定期備份資料

## 📞 支援

如有問題或建議，請：
1. 檢查本文件的故障排除部分
2. 查看 GitHub Issues
3. 聯繫開發團隊

---

**注意**: 請確保遵守相關的 API 使用條款和隱私政策。生成的圖片僅供個人使用，請勿用於商業用途。
