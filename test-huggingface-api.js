const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function testHuggingFaceAPI() {
  console.log('🧪 測試 Hugging Face Space API...');
  
  const hfUrl = 'https://keithskk321-ice-solution-faceswap.hf.space';
  
  try {
    // 1. 測試健康檢查
    console.log('📡 測試健康檢查端點...');
    const healthResponse = await axios.get(`${hfUrl}/health`);
    console.log('✅ 健康檢查成功:', healthResponse.data);
    
    // 2. 創建測試圖片
    console.log('📸 創建測試圖片...');
    const sharp = require('sharp');
    const testImagePath = path.join(__dirname, 'uploads', 'test_hf.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 3,
          background: { r: 0, g: 255, b: 0 }
        }
      }).jpeg().toFile(testImagePath);
    }
    
    // 3. 測試臉部交換 API
    console.log('🔄 測試臉部交換 API...');
    const formData = new FormData();
    formData.append('source_photo', fs.createReadStream(testImagePath));
    formData.append('target_photo', fs.createReadStream(testImagePath));
    
    const swapResponse = await axios.post(`${hfUrl}/swap`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000 // 30 秒超時
    });
    
    console.log('✅ 臉部交換 API 成功！');
    console.log('📊 回應狀態:', swapResponse.status);
    console.log('📊 回應數據:', {
      success: swapResponse.data.success,
      message: swapResponse.data.message,
      hasResult: !!swapResponse.data.result
    });
    
    if (swapResponse.data.result) {
      console.log('🖼️ 收到臉部交換結果圖片');
    }
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('💡 提示：API 端點可能尚未部署完成，請等待 2-3 分鐘後重試');
    }
  }
}

testHuggingFaceAPI();
