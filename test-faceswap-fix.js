const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function testFaceSwapFix() {
  console.log('🧪 測試修正後的臉部交換 API...');
  
  try {
    // 創建測試圖片
    const sharp = require('sharp');
    const testImagePath = path.join(__dirname, 'uploads', 'test_faceswap.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('📸 創建測試圖片...');
      await sharp({
        create: {
          width: 256,
          height: 256,
          channels: 3,
          background: { r: 255, g: 100, b: 100 }
        }
      }).jpeg().toFile(testImagePath);
    }
    
    // 讀取圖片
    const sourceImage = fs.readFileSync(testImagePath);
    const targetImage = fs.readFileSync(testImagePath);
    
    // 建立 FormData
    const formData = new FormData();
    formData.append('source_photo', sourceImage, {
      filename: 'source_photo.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('target_photo', targetImage, {
      filename: 'target_photo.jpg',
      contentType: 'image/jpeg'
    });
    
    // 發送請求到 Hugging Face Space
    const hfUrl = 'https://keithskk321-ice-solution-faceswap.hf.space';
    console.log('🔄 發送臉部交換請求...');
    
    const response = await axios.post(`${hfUrl}/swap`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 60000 // 1分鐘超時
    });
    
    console.log('✅ 臉部交換 API 成功！');
    console.log('📊 回應狀態:', response.status);
    console.log('📊 回應數據:', {
      success: response.data.success,
      message: response.data.message,
      hasResult: !!response.data.result
    });
    
    if (response.data.success && response.data.result) {
      // 從 base64 解碼圖片
      const base64Data = response.data.result.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      // 儲存結果
      const outputPath = path.join(__dirname, 'uploads', `test_result_${Date.now()}.jpg`);
      fs.writeFileSync(outputPath, imageBuffer);
      
      console.log('🖼️ 臉部交換結果已儲存:', outputPath);
    }
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.response?.data || error.message);
    
    if (error.response?.status === 422) {
      console.log('💡 422 錯誤通常表示請求格式有問題');
      console.log('📋 請檢查：');
      console.log('   - 參數名稱是否正確 (source_photo, target_photo)');
      console.log('   - 圖片格式是否支援');
      console.log('   - 圖片大小是否合適');
    }
  }
}

testFaceSwapFix();
