# 🚀 部署步驟

## 1. 創建 Hugging Face Space

1. 訪問 https://huggingface.co/spaces
2. 點擊 "Create new Space"
3. 設定：
   - Owner: Keithskk321
   - Space name: facedancer-ai
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
- Web 介面: https://Keithskk321-facedancer-ai.hf.space
- API 端點: https://Keithskk321-facedancer-ai.hf.space/swap
- 健康檢查: https://Keithskk321-facedancer-ai.hf.space/health

## 5. 更新你的程式

在 config.env 中添加：
```env
HUGGINGFACE_SPACES_URL=https://Keithskk321-facedancer-ai.hf.space
```

在 facedancer-integration.js 中更新 URL：
```javascript
const response = await axios.post('https://Keithskk321-facedancer-ai.hf.space/swap', formData, {
  // ...
});
```
