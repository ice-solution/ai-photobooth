# 🌐 域名配置說明

## 📋 環境配置

### 開發環境 (Development)
- **API**: `http://localhost:5001`
- **前端**: `http://localhost:3000`
- **代理**: 前端通過 `proxy` 設置轉發 API 請求到後端

### 生產環境 (Production)
- **API**: `https://photobooth-api.ice-solution.hk`
- **前端**: `https://photobooth.ice-solution.hk`

## 🔧 配置文件

### 1. 前端 API 配置
**文件**: `client/src/config/api.js`
```javascript
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5001',
    timeout: 30000
  },
  production: {
    baseURL: 'https://photobooth-api.ice-solution.hk',
    timeout: 30000
  }
};
```

### 2. 前端代理設置
**文件**: `client/package.json`
```json
{
  "proxy": "http://localhost:5001"
}
```

### 3. 圖片 URL 生成
**文件**: `piapi-faceswap-integration.js` 和 `local-faceswap-fallback.js`
```javascript
const baseUrl = isDevelopment 
  ? 'http://localhost:5001' 
  : 'https://photobooth-api.ice-solution.hk';
```

## 🚀 部署配置

### Nginx 配置
- **API 服務器**: `photobooth-api.ice-solution.hk`
- **前端服務器**: `photobooth.ice-solution.hk`

### 服務架構
```
用戶 → photobooth.ice-solution.hk (前端)
     ↓
     photobooth-api.ice-solution.hk (API)
     ↓
     Node.js 後端服務
```

## ✅ 驗證清單

### 開發環境
- [ ] 後端服務器運行在 `localhost:5001`
- [ ] 前端開發服務器運行在 `localhost:3000`
- [ ] 前端代理正確轉發 API 請求
- [ ] 所有 API 端點正常響應

### 生產環境
- [ ] API 域名 `photobooth-api.ice-solution.hk` 可訪問
- [ ] 前端域名 `photobooth.ice-solution.hk` 可訪問
- [ ] SSL 證書正確配置
- [ ] 圖片上傳和訪問正常

## 🔍 故障排除

### 常見問題
1. **404 錯誤**: 檢查 API 域名是否正確
2. **CORS 錯誤**: 確保前端和 API 域名配置正確
3. **圖片無法顯示**: 檢查圖片 URL 是否指向正確的 API 域名

### 測試命令
```bash
# 測試 API 健康檢查
curl https://photobooth-api.ice-solution.hk/api/health

# 測試前端可訪問性
curl -I https://photobooth.ice-solution.hk
```

## 📝 更新記錄

- **2025-08-21**: 修正域名配置，API 和前端分離
  - API: `photobooth-api.ice-solution.hk`
  - 前端: `photobooth.ice-solution.hk`
