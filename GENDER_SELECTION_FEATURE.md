# 性別選擇功能實現

## 🎯 功能概述

為了避免女性玩家變成男性圖片的情況，我們實現了性別選擇功能，讓玩家在拍照後選擇性別，然後根據性別生成對應的 Stability AI 圖片。

## 🔄 新的流程

### 原有流程：
1. 語音錄製 → 2. 職業驗證 → 3. 拍照 → 4. 生成職業照 → 5. 臉部交換 → 6. 結果顯示

### 新流程：
1. 語音錄製 → 2. 職業驗證 → 3. 拍照 → **4. 性別選擇** → 5. 生成職業照 → 6. 臉部交換 → 7. 結果顯示

## 🆕 新增組件

### 1. GenderSelection.js
- **位置**: `client/src/components/GenderSelection.js`
- **功能**: 性別選擇界面
- **特色**:
  - 顯示用戶照片預覽
  - 男性/女性選擇按鈕
  - 視覺化選擇狀態
  - 詳細的使用提示

### 2. 修改的組件

#### App.js
- 添加 `userGender` 狀態
- 新增 `handleGenderSelected` 函數
- 在流程中添加性別選擇步驟
- 將性別參數傳遞給後端

#### PhotoCapture.js
- 拍照完成後跳轉到性別選擇頁面
- 不再直接生成職業照

## 🔧 後端修改

### 1. routes/generate.js
- **新增參數**: `gender` (male/female)
- **參數驗證**: 確保性別參數有效
- **提示詞調整**: 根據性別動態調整 Stability AI 提示詞
- **負面提示詞**: 根據性別排除錯誤性別特徵

### 2. models/User.js
- **新增欄位**: `gender` (String, enum: ['male', 'female'])
- **用途**: 保存用戶選擇的性別

## 🎨 提示詞調整邏輯

### 模板系統
所有職業提示詞現在使用 `{gender}` 佔位符，動態替換為 `male` 或 `female`：

```javascript
// 模板格式
'醫生': 'young asian {gender} doctor in white coat, medical setting...'

// 替換邏輯
prompt = prompt.replace(/{gender}/g, gender);
```

### 男性職業照 (gender: 'male')
```javascript
// 正面提示詞包含
"young asian male [職業] ..."

// 負面提示詞包含
"female, woman, girl"
```

### 女性職業照 (gender: 'female')
```javascript
// 正面提示詞包含
"young asian female [職業] ..."

// 負面提示詞包含
"male, man, boy"
```

### 通用模板
對於未定義的職業，使用通用模板：
```javascript
`young asian ${gender} ${profession} in work environment...`
```

## 🧪 測試結果

### 功能測試
- ✅ 男性職業照生成成功
- ✅ 女性職業照生成成功
- ✅ 無效性別參數驗證
- ✅ 缺少性別參數驗證

### 生成圖片
- 男性醫生: `generated_test_gender_1755778683740_1755778692762.png`
- 女性醫生: `generated_test_gender_1755778683740_female_1755778700239.png`

## 🎯 解決的問題

1. **性別錯誤**: 避免女性玩家生成男性職業照
2. **用戶體驗**: 讓用戶主動選擇性別，提高準確性
3. **AI 生成**: 根據性別優化 Stability AI 提示詞
4. **數據完整性**: 在數據庫中保存性別資訊
5. **提示詞模板**: 使用 `{gender}` 佔位符，確保性別替換的準確性

## 💡 使用建議

1. **用戶指導**: 在性別選擇頁面提供清晰的說明
2. **視覺反饋**: 使用不同顏色區分男性和女性選項
3. **錯誤處理**: 確保性別參數驗證的完整性
4. **測試覆蓋**: 測試各種職業和性別組合

## 🔄 部署注意事項

1. **數據庫遷移**: 確保 User 模型包含 gender 欄位
2. **API 兼容性**: 確保前端傳遞 gender 參數
3. **錯誤處理**: 處理缺少性別參數的情況
4. **用戶體驗**: 確保流程順暢，不會卡在性別選擇頁面

## 📊 技術細節

### API 端點修改
```javascript
POST /api/generate/profession-photo
{
  "profession": "醫生",
  "gender": "male", // 新增參數
  "sessionId": "xxx"
}
```

### 響應格式
```javascript
{
  "success": true,
  "imageUrl": "/uploads/generated_xxx.png",
  "message": "職業照生成成功"
}
```

### 錯誤處理
```javascript
{
  "error": "請提供有效的性別資訊 (male/female)"
}
```

## 🎉 總結

性別選擇功能成功解決了女性玩家生成男性圖片的核心問題，通過用戶主動選擇和 AI 提示詞優化，確保生成的職業照符合用戶的性別特徵。整個實現過程包括前端界面、後端邏輯、數據庫設計和測試驗證，確保功能的完整性和可靠性。
