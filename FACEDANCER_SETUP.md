# 🎭 FaceDancer 臉部交換整合指南

## 📋 概述

本指南將幫助你整合 [FaceDancer](https://github.com/felixrosberg/FaceDancer) 到你的 AI 志願職業照生成器中，實現高品質的臉部交換功能。

## 🎯 FaceDancer 特色

- **高品質臉部交換**: 支援姿勢和遮擋感知
- **多種整合方式**: Hugging Face API 或自建服務
- **備用方案**: 當 AI 模型不可用時的降級處理
- **自動預處理**: 圖片自動調整和優化

## 🔧 整合方式

### 方式 1: 使用 Hugging Face API (推薦)

#### 1. 獲取 Hugging Face API 金鑰
1. 訪問 [Hugging Face](https://huggingface.co/)
2. 註冊或登入帳戶
3. 前往 [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. 創建新的 API 金鑰

#### 2. 設定環境變數
編輯 `config.env` 檔案：
```env
# Hugging Face API (用於 FaceDancer 臉部交換)
HUGGINGFACE_API_KEY=hf_your_actual_api_key_here
```

#### 3. 測試 API
```bash
# 測試 Hugging Face API 連接
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api-inference.huggingface.co/models/felixrosberg/FaceDancer
```

### 方式 2: 自建 FaceDancer 服務

#### 1. 安裝 Python 依賴
```bash
# 創建 Python 虛擬環境
python3 -m venv facedancer_env
source facedancer_env/bin/activate  # Linux/Mac
# 或
facedancer_env\Scripts\activate  # Windows

# 安裝依賴
pip install flask flask-cors pillow opencv-python tensorflow tensorflow-addons numpy
```

#### 2. 下載 FaceDancer 模型
```bash
# 克隆 FaceDancer 倉庫
git clone https://github.com/felixrosberg/FaceDancer.git
cd FaceDancer

# 下載預訓練模型
# 注意：需要從作者提供的連結下載模型檔案
# 將模型檔案放在 model_zoo/ 目錄下
```

#### 3. 啟動自建服務
```bash
# 啟動 FaceDancer 服務
python facedancer-server.py
```

#### 4. 設定環境變數
編輯 `config.env` 檔案：
```env
# 自建 FaceDancer 服務 URL
FACEDANCER_API_URL=http://localhost:8000
```

## 🚀 使用方式

### 自動整合
系統會自動按以下順序嘗試臉部交換：

1. **Hugging Face API** (如果設定了 API 金鑰)
2. **自建服務** (如果設定了服務 URL)
3. **備用方案** (簡單的圖片合成)

### 手動測試
```bash
# 測試臉部交換功能
curl -X POST http://localhost:5001/api/faceswap/swap \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test_session"}'
```

## 📊 效果對比

| 功能 | 原版本 | FaceDancer 版本 |
|------|--------|-----------------|
| 臉部交換品質 | 簡單合成 | AI 驅動高品質 |
| 姿勢適應 | ❌ | ✅ |
| 遮擋處理 | ❌ | ✅ |
| 自然度 | 低 | 高 |
| 處理時間 | 快 | 中等 |

## 🔍 故障排除

### Hugging Face API 問題
```bash
# 檢查 API 金鑰
echo $HUGGINGFACE_API_KEY

# 測試 API 連接
curl -H "Authorization: Bearer $HUGGINGFACE_API_KEY" \
     https://api-inference.huggingface.co/models/felixrosberg/FaceDancer
```

### 自建服務問題
```bash
# 檢查服務狀態
curl http://localhost:8000/health

# 檢查模型狀態
curl http://localhost:8000/models/status
```

### 常見錯誤
1. **API 金鑰無效**: 確認 Hugging Face API 金鑰正確
2. **模型載入失敗**: 檢查模型檔案是否存在
3. **記憶體不足**: 增加系統記憶體或使用較小的模型
4. **網路超時**: 增加請求超時時間

## 💰 費用估算

### Hugging Face API
- **免費額度**: 每月 30,000 次請求
- **付費**: $0.06/1000 次請求
- **估算**: 每次臉部交換約 $0.00006

### 自建服務
- **硬體成本**: GPU 伺服器 (可選)
- **運營成本**: 電費和維護
- **優勢**: 無 API 限制，隱私保護

## 🔒 隱私保護

### Hugging Face API
- 圖片會上傳到 Hugging Face 伺服器
- 建議不要上傳敏感圖片
- 使用後圖片會被刪除

### 自建服務
- 圖片完全在本地處理
- 不會上傳到第三方服務
- 完全保護隱私

## 📈 性能優化

### 1. 圖片預處理
- 自動調整圖片尺寸為 256x256
- 優化圖片品質和格式
- 減少處理時間

### 2. 快取機制
- 快取預處理的圖片
- 避免重複處理
- 提高響應速度

### 3. 並行處理
- 支援多個請求同時處理
- 提高整體吞吐量

## 🎨 自定義設定

### 調整圖片品質
```javascript
// 在 facedancer-integration.js 中調整
await sharp(imagePath)
  .resize(256, 256, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 95 }) // 調整品質 (1-100)
  .toFile(outputPath);
```

### 調整超時時間
```javascript
// 在 facedancer-integration.js 中調整
timeout: 60000 // 調整超時時間 (毫秒)
```

## 📞 支援

### 官方資源
- [FaceDancer GitHub](https://github.com/felixrosberg/FaceDancer)
- [Hugging Face 模型頁面](https://huggingface.co/felixrosberg/FaceDancer)
- [論文](https://openaccess.thecvf.com/content/WACV2023/papers/Rosberg_FaceDancer_Pose-_and_Occlusion-Aware_High_Fidelity_Face_Swapping_WACV_2023_paper.pdf)

### 技術支援
- 檢查日誌檔案
- 確認 API 金鑰和設定
- 測試網路連接
- 檢查模型檔案

---

**注意**: 請確保遵守相關的使用條款和隱私政策。臉部交換技術應負責任地使用。
