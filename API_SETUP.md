# API 金鑰設定指南

## 🔑 必需的 API 金鑰

要完全使用 AI 志願職業照生成器的所有功能，你需要設定以下 API 金鑰：

### 1. OpenAI API 金鑰

**用途**: 語音轉文字和職業驗證

**獲取步驟**:
1. 訪問 https://platform.openai.com/
2. 註冊或登入帳戶
3. 前往 [API Keys](https://platform.openai.com/api-keys) 頁面
4. 點擊 "Create new secret key"
5. 複製生成的金鑰

**設定方法**:
編輯 `config.env` 檔案，將以下行：
```env
OPENAI_API_KEY=your_openai_api_key_here
```
改為：
```env
OPENAI_API_KEY=sk-your_actual_openai_api_key
```

### 2. Stability AI API 金鑰

**用途**: 生成職業照

**狀態**: ✅ 已設定
- 你的 Stability AI API 金鑰已經設定在 `config.env` 中

## 🧪 測試 API 連接

### 測試 OpenAI API
```bash
# 測試職業驗證
curl -X POST http://localhost:5001/api/profession/validate \
  -H "Content-Type: application/json" \
  -d '{"text":"我想當醫生","sessionId":"test_123"}'
```

### 測試 Stability AI API
```bash
# 測試圖片生成
curl -X POST http://localhost:5001/api/generate/profession-photo \
  -H "Content-Type: application/json" \
  -d '{"profession":"醫生","sessionId":"test_123"}'
```

## 💰 API 費用估算

### OpenAI API 費用
- **Whisper (語音轉文字)**: $0.006 / 分鐘
- **GPT-3.5-turbo (職業驗證)**: $0.0015 / 1K tokens

**估算**: 每次使用約 $0.01-0.02

### Stability AI API 費用
- **SDXL 1.0**: $0.04 / 圖片

**估算**: 每次使用約 $0.04

**總計**: 每次完整流程約 $0.05-0.06

## 🔧 故障排除

### OpenAI API 錯誤 (403 Forbidden)
**原因**: API 金鑰無效或未設定
**解決方案**:
1. 確認 API 金鑰是否正確
2. 檢查 API 金鑰是否有足夠的額度
3. 確認 API 金鑰是否已啟用

### Stability AI API 錯誤
**原因**: API 金鑰無效或額度不足
**解決方案**:
1. 檢查 Stability AI 帳戶餘額
2. 確認 API 金鑰是否正確
3. 檢查 API 使用限制

### 檔案上傳錯誤
**原因**: 檔案格式不支援或大小超限
**解決方案**:
1. 確保音訊檔案格式為: mp3, wav, m4a, ogg, webm
2. 確保檔案大小不超過 10MB
3. 確保圖片檔案格式為: jpg, jpeg, png, webp

## 📊 監控 API 使用

### OpenAI 使用量監控
1. 訪問 https://platform.openai.com/usage
2. 查看 API 使用量和費用

### Stability AI 使用量監控
1. 訪問 https://platform.stability.ai/account/usage
2. 查看 API 使用量和餘額

## 🔒 安全建議

1. **不要將 API 金鑰提交到版本控制**
   - 確保 `.env` 檔案在 `.gitignore` 中
   - 使用環境變數管理敏感資訊

2. **定期輪換 API 金鑰**
   - 定期更新 API 金鑰
   - 刪除不再使用的舊金鑰

3. **監控 API 使用量**
   - 設定使用量警報
   - 定期檢查費用

## 🚀 快速測試

設定完 API 金鑰後，運行以下測試：

```bash
# 測試基本功能
node test-api.js

# 測試語音功能
node test-voice.js

# 測試健康檢查
curl http://localhost:5001/api/health
```

## 📞 支援

如果遇到 API 相關問題：

1. **OpenAI 支援**: https://help.openai.com/
2. **Stability AI 支援**: https://platform.stability.ai/docs/getting-started/support
3. **專案 Issues**: 在 GitHub 上提交 Issue

---

**注意**: 請確保遵守各 API 服務的使用條款和隱私政策。
