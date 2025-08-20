const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testFreeVersion() {
  console.log('🎉 測試免費版本 AI 志願職業照生成器\n');

  try {
    // 1. 測試健康檢查
    console.log('1. 測試健康檢查...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ 健康檢查成功:', healthResponse.data.message);
    console.log('');

    // 2. 測試語音轉文字
    console.log('2. 測試語音轉文字...');
    const voiceResponse = await axios.post(`${BASE_URL}/api/voice/transcribe`, {
      transcribedText: '我想當攝影師',
      sessionId: 'test_session_001'
    });
    console.log('✅ 語音轉文字成功:', voiceResponse.data.text);
    console.log('');

    // 3. 測試職業驗證
    console.log('3. 測試職業驗證...');
    const professionResponse = await axios.post(`${BASE_URL}/api/profession/validate`, {
      text: '我想當攝影師',
      sessionId: 'test_session_001'
    });
    console.log('✅ 職業驗證成功:', professionResponse.data.profession);
    console.log('');

    // 4. 測試圖片生成
    console.log('4. 測試圖片生成...');
    const generateResponse = await axios.post(`${BASE_URL}/api/generate/profession-photo`, {
      profession: '攝影師',
      sessionId: 'test_session_001'
    });
    console.log('✅ 圖片生成成功:', generateResponse.data.generatedPhotoUrl);
    console.log('');

    console.log('🎊 所有功能測試通過！');
    console.log('\n📝 免費版本特色:');
    console.log('- ✅ 使用 Web Speech API 進行語音轉文字（免費）');
    console.log('- ✅ 使用本地規則引擎進行職業驗證（免費）');
    console.log('- ✅ 使用 Stability AI 生成職業照（需要 API 金鑰）');
    console.log('- ✅ 無需 OpenAI API 金鑰');
    console.log('- ✅ 完全免費的語音和文字處理');

  } catch (error) {
    console.error('❌ 測試失敗:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 解決方案:');
      console.log('1. 請設定有效的 Stability AI API 金鑰');
      console.log('2. 編輯 config.env 檔案');
      console.log('3. 將 STABILITY_API_KEY 改為你的實際 API 金鑰');
    }
  }
}

testFreeVersion();
