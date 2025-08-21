const fs = require('fs');
const path = require('path');

async function testUploadEndpoint() {
  console.log('🧪 測試上傳端點...');
  
  try {
    // 創建測試圖片
    const testImagePath = path.join(__dirname, 'uploads', 'test.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('📸 創建測試圖片...');
      // 創建一個簡單的測試圖片
      const sharp = require('sharp');
      await sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      }).jpeg().toFile(testImagePath);
    }
    
    // 測試 API 端點
    const FormData = require('form-data');
    const axios = require('axios');
    
    const formData = new FormData();
    formData.append('photo', fs.createReadStream(testImagePath));
    formData.append('sessionId', 'test_session_123');
    
    console.log('📤 發送測試請求...');
    const response = await axios.post('http://localhost:5001/api/faceswap/upload-photo', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('✅ 上傳成功！');
    console.log('📊 回應:', response.data);
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.response?.data || error.message);
  }
}

testUploadEndpoint();
