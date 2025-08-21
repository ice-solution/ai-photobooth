# 🎯 Faceswap 圖片處理修正

## ✅ 問題分析

用戶反映 faceswap 後的圖片看起來被切割後再拉長，這是因為：

1. **PiAPI 返回 256x256 正方形圖片**
2. **需要輸出 896x1152 長方形圖片**
3. **舊方法使用 `fit: 'fill'` 強行拉伸，導致變形**

## 🔧 解決方案

### 舊方法 (問題)
```javascript
// 直接拉伸，導致變形
const resizedBuffer = await sharp(imageResponse.data)
  .resize(896, 1152, {
    kernel: sharp.kernel.lanczos3,
    fit: 'fill',  // 強行拉伸
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  })
  .jpeg({ quality: 98 })
  .toBuffer();
```

### 新方法 (修正)
```javascript
// 1. 先將 256x256 放大到 896x896 (保持正方形)
const squareBuffer = await sharp(imageResponse.data)
  .resize(896, 896, {
    kernel: sharp.kernel.lanczos3,
    fit: 'fill'
  })
  .toBuffer();

// 2. 創建 896x1152 畫布，將正方形圖片垂直居中
const resizedBuffer = await sharp({
  create: {
    width: 896,
    height: 1152,
    channels: 3,
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
})
.composite([{
  input: squareBuffer,
  top: Math.floor((1152 - 896) / 2),  // 垂直居中
  left: 0,
  blend: 'over'
}])
.jpeg({ quality: 98 })
.toBuffer();
```

## 📊 測試結果

### 三種方法比較

| 方法 | 效果 | 文件大小 | 推薦度 |
|------|------|----------|--------|
| 拉伸方法 | 人臉變形 | 48.47 KB | ❌ |
| 畫布方法 (頂部) | 人臉在上半部分 | 43.57 KB | ⚠️ |
| **居中方法** | **人臉居中，自然** | **43.58 KB** | **✅** |

### 視覺效果
- **拉伸方法**: 人臉被強行拉長，看起來不自然
- **畫布方法**: 人臉在頂部，下半部分空白
- **居中方法**: 人臉在中央，上下都有適當的空白，最自然

## 🎯 技術細節

### 居中計算
```javascript
top: Math.floor((1152 - 896) / 2)  // = 128
```
- 畫布高度: 1152px
- 圖片高度: 896px
- 上方空白: (1152 - 896) / 2 = 128px
- 下方空白: 128px

### 處理流程
1. **PiAPI 返回**: 256x256 正方形人臉圖片
2. **第一步**: 放大到 896x896 (保持正方形比例)
3. **第二步**: 創建 896x1152 白色畫布
4. **第三步**: 將 896x896 圖片垂直居中放置
5. **第四步**: 輸出高質量 JPEG

## 🎉 效果改善

### 修正前
- ❌ 人臉被強行拉伸變形
- ❌ 看起來不自然
- ❌ 用戶體驗差

### 修正後
- ✅ 人臉保持自然比例
- ✅ 垂直居中，視覺平衡
- ✅ 白色背景，專業外觀
- ✅ 高質量輸出 (98% JPEG)

## 🔍 其他考慮方案

### 方案 1: 頂部放置
```javascript
top: 0  // 放在頂部
```
- 優點: 人臉在主要位置
- 缺點: 下半部分空白較多

### 方案 2: 智能裁剪
```javascript
fit: 'cover',
position: 'center'
```
- 優點: 填滿整個畫布
- 缺點: 可能裁剪掉重要部分

### 方案 3: 居中放置 (選擇)
```javascript
top: Math.floor((1152 - 896) / 2)
```
- 優點: 視覺平衡，自然
- 缺點: 上下都有空白

## 🎯 總結

通過將 PiAPI 返回的 256x256 正方形圖片智能處理為 896x1152 長方形：

1. **避免變形**: 不再強行拉伸
2. **保持比例**: 人臉保持自然形狀
3. **視覺平衡**: 垂直居中放置
4. **專業外觀**: 白色背景，高質量輸出

這個修正將大大改善 faceswap 後的圖片質量，讓用戶獲得更自然、更專業的職業照！🎯✨
