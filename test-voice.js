const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5001';

async function testVoiceTranscription() {
  console.log('🎤 測試語音轉文字功能...\n');

  try {
    // 檢查上傳目錄
    const uploadPath = path.resolve('./uploads');
    console.log('📁 上傳目錄:', uploadPath);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('✅ 建立上傳目錄');
    }

    // 測試職業驗證（不需要語音檔案）
    console.log('1. 測試職業驗證...');
    const validationResponse = await axios.post(`${BASE_URL}/api/profession/validate`, {
      text: '我想當醫生',
      sessionId: 'test_session_123'
    });
    console.log('✅ 職業驗證成功:', validationResponse.data);
    console.log('');

    console.log('🎉 基本功能測試通過！');
    console.log('\n📝 注意事項:');
    console.log('- 語音轉文字功能需要有效的 OpenAI API 金鑰');
    console.log('- 請確保在 config.env 中設定了正確的 OPENAI_API_KEY');
    console.log('- 語音檔案格式支援: mp3, wav, m4a, ogg, webm');
    console.log('- 檔案大小限制: 10MB');

  } catch (error) {
    console.error('❌ 測試失敗:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 解決方案:');
      console.log('1. 請設定有效的 OpenAI API 金鑰');
      console.log('2. 編輯 config.env 檔案');
      console.log('3. 將 OPENAI_API_KEY=your_openai_api_key_here 改為你的實際 API 金鑰');
    }
  }
}

testVoiceTranscription();
