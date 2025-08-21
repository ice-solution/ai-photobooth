// 測試會話流程
console.log('🧪 測試會話流程...');

const axios = require('axios');

async function testSessionFlow() {
  try {
    console.log('\n📋 測試步驟:');
    console.log('1. 創建會話並進行語音轉文字');
    console.log('2. 驗證職業');
    console.log('3. 上傳照片');
    console.log('4. 檢查數據庫狀態');
    
    const baseURL = 'http://localhost:5001';
    const sessionId = `test_session_${Date.now()}`;
    
    // 步驟 1: 語音轉文字
    console.log('\n🎤 步驟 1: 語音轉文字...');
    const voiceResponse = await axios.post(`${baseURL}/api/voice/transcribe`, {
      transcribedText: '我想當醫生',
      sessionId: sessionId
    });
    
    if (voiceResponse.data.success) {
      console.log('✅ 語音轉文字成功');
      console.log('📝 文字:', voiceResponse.data.text);
      console.log('🆔 會話ID:', voiceResponse.data.sessionId);
    } else {
      console.log('❌ 語音轉文字失敗:', voiceResponse.data.error);
      return;
    }
    
    // 步驟 2: 職業驗證
    console.log('\n🏥 步驟 2: 職業驗證...');
    const professionResponse = await axios.post(`${baseURL}/api/profession/validate`, {
      text: '我想當醫生',
      sessionId: sessionId
    });
    
    if (professionResponse.data.valid) {
      console.log('✅ 職業驗證成功');
      console.log('🏥 職業:', professionResponse.data.profession);
    } else {
      console.log('❌ 職業驗證失敗:', professionResponse.data.message);
      return;
    }
    
    // 步驟 3: 檢查用戶狀態
    console.log('\n👤 步驟 3: 檢查用戶狀態...');
    try {
      const userResponse = await axios.get(`${baseURL}/api/voice/text/${sessionId}`);
      console.log('✅ 用戶狀態檢查成功');
      console.log('📊 狀態:', userResponse.data);
    } catch (error) {
      console.log('❌ 用戶狀態檢查失敗:', error.response?.data?.error || error.message);
    }
    
    // 步驟 4: 模擬照片上傳
    console.log('\n📸 步驟 4: 模擬照片上傳...');
    
    // 創建一個簡單的測試圖片（使用真實的 JPEG 數據）
    const fs = require('fs');
    const FormData = require('form-data');
    const formData = new FormData();
    
    // 檢查是否有現有的測試圖片
    const testImagePath = './uploads/test_target_896x1152.png';
    if (fs.existsSync(testImagePath)) {
      const testImageBuffer = fs.readFileSync(testImagePath);
      formData.append('photo', testImageBuffer, {
        filename: 'test.png',
        contentType: 'image/png'
      });
    } else {
      // 如果沒有現有圖片，創建一個簡單的測試圖片
      const testImageBuffer = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
        0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
        0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
        0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
        0xFF, 0xD9
      ]);
      formData.append('photo', testImageBuffer, {
        filename: 'test.jpg',
        contentType: 'image/jpeg'
      });
    }
    formData.append('sessionId', sessionId);
    
    try {
      const uploadResponse = await axios.post(`${baseURL}/api/faceswap/upload-photo`, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      
      if (uploadResponse.data.success) {
        console.log('✅ 照片上傳成功');
        console.log('📁 照片URL:', uploadResponse.data.photoUrl);
      } else {
        console.log('❌ 照片上傳失敗:', uploadResponse.data.error);
      }
    } catch (error) {
      console.log('❌ 照片上傳錯誤:', error.response?.data?.error || error.message);
      if (error.response?.data?.details) {
        console.log('📝 詳細錯誤:', error.response.data.details);
      }
    }
    
    console.log('\n🎉 會話流程測試完成！');
    
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error.message);
    if (error.response) {
      console.error('📝 錯誤詳情:', error.response.data);
    }
  }
}

// 執行測試
testSessionFlow();
