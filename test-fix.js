const FaceDancerIntegration = require('./facedancer-integration');

async function testFix() {
  console.log('🧪 測試修正的臉部交換...');
  
  const faceDancer = new FaceDancerIntegration();
  
  // 創建測試圖片路徑
  const sourceImagePath = './uploads/test_source.jpg';
  const targetImagePath = './uploads/test_target.jpg';
  
  try {
    console.log('📸 測試圖片路徑:');
    console.log('- 源臉部:', sourceImagePath);
    console.log('- 目標圖片:', targetImagePath);
    
    // 檢查檔案是否存在
    const fs = require('fs');
    if (!fs.existsSync(sourceImagePath) || !fs.existsSync(targetImagePath)) {
      console.log('⚠️ 測試圖片不存在，創建模擬測試...');
      
      // 創建測試目錄
      if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads', { recursive: true });
      }
      
      // 創建簡單的測試圖片 (1x1 像素)
      const sharp = require('sharp');
      await sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      }).jpeg().toFile(sourceImagePath);
      
      await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 3,
          background: { r: 0, g: 255, b: 0 }
        }
      }).jpeg().toFile(targetImagePath);
      
      console.log('✅ 創建測試圖片完成');
    }
    
    // 測試臉部交換
    console.log('🔄 開始臉部交換測試...');
    const resultPath = await faceDancer.performFaceSwap(sourceImagePath, targetImagePath);
    
    console.log('✅ 臉部交換測試成功！');
    console.log('📁 結果圖片:', resultPath);
    
    // 檢查結果檔案
    if (fs.existsSync(resultPath)) {
      const stats = fs.statSync(resultPath);
      console.log('📊 結果檔案大小:', stats.size, 'bytes');
      console.log('✅ 結果檔案存在且有效');
    } else {
      console.log('❌ 結果檔案不存在');
    }
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.error('🔍 錯誤詳情:', error.stack);
  }
}

// 運行測試
testFix();
