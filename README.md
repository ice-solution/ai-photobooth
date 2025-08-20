# AI 志願職業照生成器

一個創新的 AI 應用程式，讓使用者透過語音說出夢想職業，然後拍攝正面照片，AI 會生成專業的職業照並進行臉部交換。

## 🚀 功能特色

- **語音轉文字**: 使用 OpenAI Whisper API 將語音轉換為文字
- **職業驗證**: 智能驗證語音內容中的職業是否合法合理
- **AI 圖片生成**: 使用 Stability AI API 生成專業職業照
- **臉部交換**: 將使用者的臉部特徵融入生成的職業照
- **現代化 UI**: 美觀的 React 前端介面，支援響應式設計
- **即時處理**: 即時顯示處理進度和狀態

## 🛠️ 技術架構

### 後端 (Node.js + Express)
- **Express.js**: Web 框架
- **MongoDB**: 資料庫儲存
- **Mongoose**: ODM 工具
- **Multer**: 檔案上傳處理
- **Sharp**: 圖片處理
- **Axios**: HTTP 請求

### 前端 (React)
- **React 18**: 前端框架
- **Framer Motion**: 動畫效果
- **Tailwind CSS**: 樣式框架
- **React Webcam**: 拍照功能
- **React Audio Voice Recorder**: 語音錄製
- **React Hot Toast**: 通知提示

### AI 服務
- **OpenAI Whisper**: 語音轉文字
- **OpenAI GPT**: 職業驗證
- **Stability AI**: 圖片生成

## 📋 系統需求

- Node.js 16+ 
- MongoDB 4.4+
- npm 或 yarn

## 🚀 快速開始

### 1. 克隆專案
```bash
git clone <repository-url>
cd ai-photobooth
```

### 2. 安裝依賴
```bash
# 安裝後端依賴
npm install

# 安裝前端依賴
cd client
npm install
cd ..
```

### 3. 環境設定
複製 `config.env` 檔案並填入你的 API 金鑰：

```env
# Stability AI API 設定
STABILITY_API_KEY=your_stability_api_key
STABILITY_API_URL=https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image

# MongoDB 設定
MONGODB_URI=mongodb://localhost:27017/ai-photobooth

# OpenAI API (用於語音轉文字和職業驗證)
OPENAI_API_KEY=your_openai_api_key

# 伺服器設定
PORT=5000
NODE_ENV=development

# 檔案上傳設定
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 4. 啟動 MongoDB
確保 MongoDB 服務正在運行：
```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

### 5. 啟動應用程式
```bash
# 開發模式 (同時啟動前後端)
npm run dev

# 或者分別啟動
# 後端
npm start

# 前端 (新終端)
npm run client
```

### 6. 訪問應用程式
開啟瀏覽器訪問：http://localhost:3000

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

## 🔧 開發指南

### 專案結構
```
ai-photobooth/
├── server.js              # 主伺服器檔案
├── package.json           # 後端依賴
├── config.env             # 環境變數
├── models/                # 資料模型
│   └── User.js
├── routes/                # API 路由
│   ├── voice.js          # 語音處理
│   ├── profession.js     # 職業驗證
│   ├── generate.js       # 圖片生成
│   └── faceswap.js       # 臉部交換
├── uploads/              # 上傳檔案目錄
└── client/               # React 前端
    ├── package.json
    ├── public/
    └── src/
        ├── components/   # React 組件
        ├── utils/        # 工具函數
        └── App.js        # 主應用
```

### API 端點

#### 語音處理
- `POST /api/voice/transcribe` - 語音轉文字
- `GET /api/voice/text/:sessionId` - 獲取語音文字

#### 職業驗證
- `POST /api/profession/validate` - 驗證職業
- `GET /api/profession/info/:sessionId` - 獲取職業資訊

#### 圖片生成
- `POST /api/generate/profession-photo` - 生成職業照
- `GET /api/generate/status/:sessionId` - 獲取生成狀態

#### 臉部交換
- `POST /api/faceswap/upload-photo` - 上傳使用者照片
- `POST /api/faceswap/swap` - 執行臉部交換
- `GET /api/faceswap/result/:sessionId` - 獲取最終結果

## 🐛 故障排除

### 常見問題

1. **MongoDB 連接失敗**
   - 確保 MongoDB 服務正在運行
   - 檢查 `MONGODB_URI` 設定是否正確

2. **API 金鑰錯誤**
   - 確認 Stability AI 和 OpenAI API 金鑰是否有效
   - 檢查 API 金鑰是否有足夠的額度

3. **檔案上傳失敗**
   - 確保 `uploads` 目錄存在且有寫入權限
   - 檢查檔案大小是否超過限制

4. **前端無法連接後端**
   - 確認後端服務正在運行在 port 5000
   - 檢查 CORS 設定

### 日誌查看
```bash
# 查看後端日誌
npm run dev

# 查看前端日誌
cd client && npm start
```

## 📄 授權

本專案採用 MIT 授權條款。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 支援

如有問題或建議，請聯繫開發團隊。

---

**注意**: 請確保遵守相關的 API 使用條款和隱私政策。生成的圖片僅供個人使用，請勿用於商業用途。
