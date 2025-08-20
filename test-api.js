const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testAPI() {
  console.log('🧪 開始測試 AI 志願職業照生成器 API...\n');

  try {
    // 測試健康檢查
    console.log('1. 測試健康檢查...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ 健康檢查成功:', healthResponse.data);
    console.log('');

    // 測試職業驗證
    console.log('2. 測試職業驗證...');
    const validationResponse = await axios.post(`${BASE_URL}/api/profession/validate`, {
      text: '我想當醫生',
      sessionId: 'test_session_123'
    });
    console.log('✅ 職業驗證成功:', validationResponse.data);
    console.log('');

    console.log('🎉 所有 API 測試通過！');
    console.log('\n📝 使用說明:');
    console.log('- 後端服務運行在: http://localhost:5001');
    console.log('- 前端應用運行在: http://localhost:3000');
    console.log('- 請在瀏覽器中訪問 http://localhost:3000 開始使用');

  } catch (error) {
    console.error('❌ API 測試失敗:', error.response?.data || error.message);
  }
}

testAPI();
