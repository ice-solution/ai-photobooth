# 🚀 Hugging Face FaceDancer 部署指南

## 📋 概述

本指南將幫助你在 Hugging Face Spaces 上部署 FaceDancer 臉部交換服務，並在你的程式中使用它。

## 🎯 部署步驟

### 步驟 1: 準備 Hugging Face 帳戶

1. 訪問 [Hugging Face](https://huggingface.co/)
2. 註冊或登入帳戶
3. 前往 [Spaces](https://huggingface.co/spaces)

### 步驟 2: 創建新的 Space

1. 點擊 "Create new Space"
2. 選擇以下設定：
   - **Owner**: 你的用戶名
   - **Space name**: `facedancer-ai` (或你喜歡的名稱)
   - **Space SDK**: `Gradio`
   - **Space hardware**: `CPU` (免費) 或 `GPU` (付費)
   - **License**: `MIT`

### 步驟 3: 上傳檔案

將以下檔案上傳到你的 Space：

#### 主要檔案
- `app.py` - Gradio 應用程式
- `api.py` - FastAPI 端點
- `requirements.txt` - Python 依賴
- `README.md` - 說明檔案

#### 檔案結構
```
your-username-facedancer/
├── app.py
├── api.py
├── requirements.txt
└── README.md
```

### 步驟 4: 設定環境變數

在 Space 設定中添加環境變數：
- `GRADIO_SERVER_NAME`: `0.0.0.0`
- `GRADIO_SERVER_PORT`: `7860`

### 步驟 5: 部署

1. 提交所有檔案
2. Hugging Face 會自動構建和部署
3. 等待部署完成 (約 5-10 分鐘)

## 🔧 在你的程式中使用

### 更新配置

編輯 `config.env` 檔案：
```env
# Hugging Face Spaces URL
HUGGINGFACE_SPACES_URL=https://your-username-facedancer.hf.space
```

### 更新程式碼

在 `facedancer-integration.js` 中更新 URL：
```javascript
// 發送請求到 Hugging Face Spaces
const response = await axios.post('https://your-username-facedancer.hf.space/swap', formData, {
  headers: {
    ...formData.getHeaders()
  },
  responseType: 'arraybuffer',
  timeout: 120000 // 2分鐘超時
});
```

## 🧪 測試部署

### 1. 測試 Web 介面
訪問你的 Space URL: `https://your-username-facedancer.hf.space`

### 2. 測試 API 端點
```bash
# 測試健康檢查
curl https://your-username-facedancer.hf.space/health

# 測試臉部交換 API
curl -X POST https://your-username-facedancer.hf.space/swap \
  -F "source_face=@source.jpg" \
  -F "target_image=@target.jpg" \
  -o result.jpg
```

### 3. 在你的程式中測試
```bash
# 運行測試腳本
node test-facedancer.js
```

## 📊 性能優化

### 1. 硬體選擇
- **CPU**: 免費，適合測試
- **GPU**: 付費，處理速度更快
- **T4**: 推薦用於生產環境

### 2. 快取設定
```python
# 在 app.py 中添加快取
@gr.cache()
def cached_face_swap(source_image, target_image):
    return inference_engine.perform_face_swap(source_image, target_image)
```

### 3. 並行處理
```python
# 支援多個請求同時處理
demo.queue(concurrency_count=3)
```

## 🔍 故障排除

### 常見問題

1. **部署失敗**
   - 檢查 `requirements.txt` 是否正確
   - 確認所有依賴都可用
   - 查看構建日誌

2. **API 無響應**
   - 檢查 Space 是否正在運行
   - 確認端點 URL 正確
   - 查看錯誤日誌

3. **處理超時**
   - 增加超時時間
   - 使用 GPU 硬體
   - 優化圖片大小

### 日誌查看

在 Hugging Face Spaces 中：
1. 前往你的 Space
2. 點擊 "Settings"
3. 查看 "Logs" 標籤

## 💰 費用估算

### 免費方案
- **硬體**: CPU
- **使用限制**: 每月 30 小時
- **費用**: 免費

### 付費方案
- **T4 GPU**: $0.60/小時
- **A10G GPU**: $2.00/小時
- **A100 GPU**: $4.00/小時

## 🔒 安全考慮

### 1. 圖片隱私
- 圖片會上傳到 Hugging Face 伺服器
- 建議不要上傳敏感圖片
- 使用後圖片會被刪除

### 2. API 限制
- 設定請求頻率限制
- 添加身份驗證
- 監控使用量

### 3. 內容審核
- 添加內容過濾
- 防止濫用
- 遵守使用條款

## 📈 監控和維護

### 1. 使用量監控
- 查看 Space 使用統計
- 監控 API 調用次數
- 追蹤錯誤率

### 2. 性能監控
- 監控響應時間
- 追蹤處理成功率
- 優化瓶頸

### 3. 定期維護
- 更新依賴
- 修復安全漏洞
- 優化性能

## 🎉 完成部署

部署完成後，你的 FaceDancer 服務將可以通過以下方式訪問：

- **Web 介面**: `https://your-username-facedancer.hf.space`
- **API 端點**: `https://your-username-facedancer.hf.space/swap`
- **健康檢查**: `https://your-username-facedancer.hf.space/health`

現在你可以在你的 AI 志願職業照生成器中使用這個高品質的臉部交換服務了！

---

**注意**: 請確保遵守 Hugging Face 的使用條款和相關法律法規。
