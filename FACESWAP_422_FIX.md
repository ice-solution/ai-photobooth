# 🔧 FaceDancer 422 錯誤修正

## 🚨 問題描述

在使用 Hugging Face Space 進行臉部交換時出現 422 錯誤：
```
❌ Hugging Face FaceDancer 錯誤: Request failed with status code 422
```

## 🔍 問題分析

422 錯誤表示 "Unprocessable Entity"，通常是由於：
1. **參數名稱不匹配** - API 期望的參數名稱與實際發送的不一致
2. **請求格式錯誤** - 數據格式不符合 API 要求
3. **圖片格式問題** - 上傳的圖片格式或大小不符合要求

## ✅ 修正方案

### 1. 參數名稱修正

**修正前：**
```javascript
formData.append('source_face', sourceImage, {
  filename: 'source_face.jpg',
  contentType: 'image/jpeg'
});
formData.append('target_image', targetImage, {
  filename: 'target_image.jpg',
  contentType: 'image/jpeg'
});
```

**修正後：**
```javascript
formData.append('source_photo', sourceImage, {
  filename: 'source_photo.jpg',
  contentType: 'image/jpeg'
});
formData.append('target_photo', targetImage, {
  filename: 'target_photo.jpg',
  contentType: 'image/jpeg'
});
```

### 2. 回應處理修正

**修正前：**
```javascript
// 期望二進制圖片回應
responseType: 'arraybuffer',
fs.writeFileSync(outputPath, response.data);
```

**修正後：**
```javascript
// 處理 JSON 回應中的 base64 圖片
if (response.data.success && response.data.result) {
  const base64Data = response.data.result.replace(/^data:image\/[a-z]+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(outputPath, imageBuffer);
}
```

## 🧪 測試結果

修正後的測試結果：
```
🧪 測試修正後的臉部交換 API...
📸 創建測試圖片...
🔄 發送臉部交換請求...
✅ 臉部交換 API 成功！
📊 回應狀態: 200
📊 回應數據: { success: true, message: '臉部交換成功', hasResult: true }
🖼️ 臉部交換結果已儲存: /Users/leungkeith/projects/ai-photobooth/uploads/test_result_1755696476245.jpg
```

## 📋 API 端點規格

### Hugging Face Space API

**端點：** `https://keithskk321-ice-solution-faceswap.hf.space/swap`

**方法：** POST

**參數：**
- `source_photo` (file) - 源臉部圖片
- `target_photo` (file) - 目標圖片

**回應格式：**
```json
{
  "success": true,
  "result": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "message": "臉部交換成功"
}
```

## 🎯 修正文件

1. **facedancer-integration.js** - 主要修正文件
2. **test-faceswap-fix.js** - 測試腳本
3. **FACESWAP_422_FIX.md** - 本文檔

## ✅ 驗證步驟

1. **健康檢查：**
   ```bash
   curl https://keithskk321-ice-solution-faceswap.hf.space/health
   ```

2. **臉部交換測試：**
   ```bash
   node test-faceswap-fix.js
   ```

3. **應用測試：**
   - 啟動應用：`node server.js`
   - 訪問前端進行完整流程測試

## 🎉 結果

- ✅ 422 錯誤已解決
- ✅ Hugging Face Space API 正常工作
- ✅ 臉部交換功能正常運行
- ✅ 備用方案仍然可用

現在你的應用可以正常使用 Hugging Face Space 進行高質量的臉部交換了！
