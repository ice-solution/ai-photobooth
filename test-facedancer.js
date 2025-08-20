const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5001';

async function testFaceDancer() {
  console.log('🎭 測試 FaceDancer 臉部交換功能\n');

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
      sessionId: 'facedancer_test_001'
    });
    console.log('✅ 語音轉文字成功:', voiceResponse.data.text);
    console.log('');

    // 3. 測試職業驗證
    console.log('3. 測試職業驗證...');
    const professionResponse = await axios.post(`${BASE_URL}/api/profession/validate`, {
      text: '我想當攝影師',
      sessionId: 'facedancer_test_001'
    });
    console.log('✅ 職業驗證成功:', professionResponse.data.profession);
    console.log('');

    // 4. 測試圖片生成
    console.log('4. 測試圖片生成...');
    const generateResponse = await axios.post(`${BASE_URL}/api/generate/profession-photo`, {
      profession: '攝影師',
      sessionId: 'facedancer_test_001'
    });
    console.log('✅ 圖片生成成功:', generateResponse.data.generatedPhotoUrl);
    console.log('');

    // 5. 測試臉部交換
    console.log('5. 測試 FaceDancer 臉部交換...');
    const faceswapResponse = await axios.post(`${BASE_URL}/api/faceswap/swap`, {
      sessionId: 'facedancer_test_001'
    });
    console.log('✅ 臉部交換成功:', faceswapResponse.data.finalPhotoUrl);
    console.log('');

    console.log('🎊 FaceDancer 整合測試完成！');
    console.log('\n📝 FaceDancer 特色:');
    console.log('- ✅ 高品質 AI 臉部交換');
    console.log('- ✅ 支援姿勢和遮擋感知');
    console.log('- ✅ 多種整合方式 (Hugging Face API / 自建服務)');
    console.log('- ✅ 自動備用方案');
    console.log('- ✅ 圖片預處理優化');

    console.log('\n🔧 設定選項:');
    console.log('1. Hugging Face API (推薦): 設定 HUGGINGFACE_API_KEY');
    console.log('2. 自建服務: 設定 FACEDANCER_API_URL');
    console.log('3. 備用方案: 自動降級到簡單合成');

  } catch (error) {
    console.error('❌ 測試失敗:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 解決方案:');
      console.log('1. 請設定有效的 API 金鑰');
      console.log('2. 編輯 config.env 檔案');
      console.log('3. 設定 HUGGINGFACE_API_KEY 或 FACEDANCER_API_URL');
    }
  }
}

testFaceDancer();
