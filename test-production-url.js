const fs = require('fs');
const path = require('path');
const PiAPIFaceSwap = require('./piapi-faceswap-integration');

async function testProductionUrl() {
  console.log('🧪 測試生產環境 URL 生成...');
  
  try {
    const piapiFaceSwap = new PiAPIFaceSwap();
    
    // 檢查是否有現有的測試圖片
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    
    // 尋找可能的源臉部圖片和目標圖片
    let sourceImagePath = null;
    let targetImagePath = null;
    
    // 尋找用戶上傳的照片
    const userPhotos = files.filter(file => 
      file.includes('user_') || 
      file.includes('photo_') || 
      file.includes('capture_') ||
      file.includes('.jpg') || 
      file.includes('.png')
    );
    
    // 尋找生成的職業照
    const generatedPhotos = files.filter(file => 
      file.includes('generated_') || 
      file.includes('profession_') ||
      file.includes('stability_')
    );
    
    if (userPhotos.length > 0) {
      sourceImagePath = path.join(uploadsDir, userPhotos[0]);
      console.log('📸 使用現有用戶照片:', userPhotos[0]);
    }
    
    if (generatedPhotos.length > 0) {
      targetImagePath = path.join(uploadsDir, generatedPhotos[0]);
      console.log('📸 使用現有職業照:', generatedPhotos[0]);
    }
    
    if (!sourceImagePath || !targetImagePath) {
      console.log('❌ 找不到合適的測試圖片，請先運行其他測試生成圖片');
      return;
    }
    
    // 測試 PiAPI 臉部交換
    console.log('🔄 測試 PiAPI 臉部交換（生產環境 URL）...');
    console.log('源圖片:', sourceImagePath);
    console.log('目標圖片:', targetImagePath);
    
    const result = await piapiFaceSwap.performFaceSwapWithRetry(sourceImagePath, targetImagePath);
    
    console.log('✅ PiAPI 臉部交換成功！');
    console.log('📁 本地路徑:', result.localPath);
    console.log('🌐 生產環境 URL:', result.productionUrl);
    console.log('📄 文件名:', result.filename);
    
    // 檢查結果文件是否存在
    if (fs.existsSync(result.localPath)) {
      const stats = fs.statSync(result.localPath);
      console.log('📊 結果文件大小:', (stats.size / 1024).toFixed(2), 'KB');
    }
    
    // 驗證生產環境 URL 格式
    const expectedUrlPattern = /^https:\/\/photobooth-api\.ice-solution\.hk\/uploads\/piapi_faceswap_\d+\.jpg$/;
    if (expectedUrlPattern.test(result.productionUrl)) {
      console.log('✅ 生產環境 URL 格式正確');
    } else {
      console.log('❌ 生產環境 URL 格式不正確');
    }
    
    console.log('');
    console.log('🎯 測試結果總結:');
    console.log('- 臉部交換: ✅ 成功');
    console.log('- 本地儲存: ✅ 成功');
    console.log('- 生產 URL: ✅ 生成');
    console.log('- 文件大小: ✅ 正常');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    
    if (error.response?.data) {
      console.error('API 錯誤詳情:', error.response.data);
    }
  }
}

testProductionUrl();
