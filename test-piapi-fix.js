require('dotenv').config({ path: './config.env' });
const PiAPIFaceSwap = require('./piapi-faceswap-integration');

async function testPiAPIFix() {
  console.log('🧪 測試 PiAPI sharp 導入修正...');
  
  try {
    // 測試 PiAPIFaceSwap 類的實例化
    console.log('🔧 創建 PiAPIFaceSwap 實例...');
    const piapiFaceSwap = new PiAPIFaceSwap();
    console.log('✅ PiAPIFaceSwap 實例創建成功');
    
    // 檢查 sharp 模組是否正確導入
    console.log('📦 檢查 sharp 模組...');
    const sharp = require('sharp');
    console.log('✅ sharp 模組導入成功');
    
    // 測試 sharp 基本功能
    console.log('🔄 測試 sharp 基本功能...');
    const testBuffer = Buffer.from('fake image data');
    try {
      await sharp(testBuffer).metadata();
      console.log('✅ sharp 功能正常');
    } catch (error) {
      console.log('⚠️ sharp 功能測試失敗（預期，因為是假數據）');
    }
    
    console.log('\n🎯 測試結果總結:');
    console.log('- PiAPIFaceSwap 類: ✅ 正常');
    console.log('- sharp 模組導入: ✅ 正常');
    console.log('- 模組依賴: ✅ 正常');
    console.log('- 修正狀態: ✅ 成功');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.error('錯誤堆疊:', error.stack);
  }
}

testPiAPIFix();
