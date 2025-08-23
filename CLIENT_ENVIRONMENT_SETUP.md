# 🌍 前端客戶端環境設置指南

## 📋 環境配置選項

### **方法 1: 使用 npm 腳本（推薦）**

#### **開發環境**:
```bash
cd client
npm start
# 或
npm run start
```

#### **生產環境**:
```bash
cd client
npm run start:prod
# 或
npm run build:prod
```

### **方法 2: 手動設置環境變量**

#### **Windows (CMD)**:
```cmd
set REACT_APP_ENV=production
npm start
```

#### **Windows (PowerShell)**:
```powershell
$env:REACT_APP_ENV="production"
npm start
```

#### **macOS/Linux**:
```bash
export REACT_APP_ENV=production
npm start
```

### **方法 3: 創建 .env 文件**

#### **在 client 目錄下創建 `.env.development`**:
```env
# 開發環境配置
REACT_APP_ENV=development
REACT_APP_API_BASE_URL=http://localhost:5001
REACT_APP_USE_PROXY=true
```

#### **在 client 目錄下創建 `.env.production`**:
```env
# 生產環境配置
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=https://photobooth-api.ice-solution.hk
REACT_APP_USE_PROXY=false
```

## 🔧 修改 API 配置

### **更新 `client/src/config/api.js`**:

```javascript
// API 配置
const API_CONFIG = {
  // 開發環境
  development: {
    baseURL: 'http://localhost:5001',
    timeout: 30000
  },
  // 生產環境
  production: {
    baseURL: 'https://photobooth-api.ice-solution.hk',
    timeout: 30000
  }
};

// 環境檢測 - 優先使用環境變量
const getEnvironment = () => {
  // 檢查環境變量
  if (process.env.REACT_APP_ENV) {
    return process.env.REACT_APP_ENV;
  }
  
  // 檢查當前域名
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
  return isDevelopment ? 'development' : 'production';
};

const env = getEnvironment();
const config = API_CONFIG[env];

// 調試信息
console.log('🔧 API 配置調試信息:');
console.log('📍 當前域名:', window.location.hostname);
console.log('🌍 環境變量:', process.env.REACT_APP_ENV);
console.log('🔍 檢測環境:', env);
console.log('🔗 Base URL:', config.baseURL);
```

## 🚀 部署到生產環境

### **步驟 1: 構建生產版本**
```bash
cd client
npm run build:prod
```

### **步驟 2: 部署到服務器**
```bash
# 將 build 目錄上傳到 photobooth.ice-solution.hk
# 或使用部署腳本
```

### **步驟 3: 配置 Nginx**
```nginx
server {
    listen 80;
    server_name photobooth.ice-solution.hk;
    
    location / {
        root /path/to/your/build;
        try_files $uri $uri/ /index.html;
    }
}
```

## ✅ 驗證環境設置

### **開發環境檢查**:
- 域名: `localhost:3000`
- API Base URL: `http://localhost:5001`
- 代理: 啟用
- 控制台日誌: 顯示開發環境信息

### **生產環境檢查**:
- 域名: `photobooth.ice-solution.hk`
- API Base URL: `https://photobooth-api.ice-solution.hk`
- 代理: 禁用
- 控制台日誌: 顯示生產環境信息

## 🔍 故障排除

### **常見問題**:
1. **環境變量不生效**: 重啟開發服務器
2. **API 調用失敗**: 檢查 Base URL 是否正確
3. **CORS 錯誤**: 確認生產環境域名配置

### **調試命令**:
```bash
# 檢查當前環境
echo $REACT_APP_ENV

# 檢查構建結果
npm run build:prod
ls -la build/

# 檢查 API 配置
curl -I https://photobooth-api.ice-solution.hk/api/health
```

## 📝 注意事項

1. **環境變量**: 必須以 `REACT_APP_` 開頭
2. **重啟服務器**: 修改環境變量後需要重啟
3. **構建優化**: 生產構建會自動優化代碼
4. **緩存清理**: 部署後可能需要清理瀏覽器緩存
