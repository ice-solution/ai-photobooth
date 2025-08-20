const FaceDancerIntegration = require('./facedancer-integration');
const path = require('path');

async function testImprovedFaceSwap() {
  console.log('🧪 測試改進的臉部交換效果...');
  
  const faceDancer = new FaceDancerIntegration();
  
  // 測試圖片路徑 (請替換為實際的測試圖片)
  const sourceImagePath = path.join(__dirname, 'uploads', 'user_photo.jpg');
  const targetImagePath = path.join(__dirname, 'uploads', 'ai_generated.jpg');
  
  try {
    console.log('📸 源臉部圖片:', sourceImagePath);
    console.log('🎯 目標圖片:', targetImagePath);
    
    // 執行臉部交換
    const resultPath = await faceDancer.performFaceSwap(sourceImagePath, targetImagePath);
    
    console.log('✅ 臉部交換完成！');
    console.log('📁 結果圖片:', resultPath);
    console.log('');
    console.log('🎭 改進效果：');
    console.log('- 智能臉部定位');
    console.log('- 橢圓形遮罩邊緣模糊');
    console.log('- 顏色平衡調整');
    console.log('- 更好的光線匹配');
    console.log('');
    console.log('📋 建議：');
    console.log('1. 確保源臉部圖片清晰且正面');
    console.log('2. 目標圖片光線適中');
    console.log('3. 臉部角度相近效果更好');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
  }
}

// 如果直接運行此腳本
if (require.main === module) {
  testImprovedFaceSwap();
}

module.exports = testImprovedFaceSwap;
