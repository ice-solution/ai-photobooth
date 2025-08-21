require('dotenv').config({ path: './config.env' });
const axios = require('axios');

async function testProfessionValidation() {
  console.log('🧪 測試新的職業驗證邏輯...');
  
  // 測試案例
  const testCases = [
    // 創意職業 - 應該通過
    { text: '我想當太空人', expected: 'pass', description: '太空人' },
    { text: '我要做特首', expected: 'pass', description: '特首' },
    { text: '我想成為總統', expected: 'pass', description: '總統' },
    { text: '我要當市長', expected: 'pass', description: '市長' },
    { text: '我想做議員', expected: 'pass', description: '議員' },
    { text: '我要成為法官', expected: 'pass', description: '法官' },
    { text: '我想當外交官', expected: 'pass', description: '外交官' },
    { text: '我要做海盜王', expected: 'pass', description: '海盜王' },
    { text: '我想成為超級英雄', expected: 'pass', description: '超級英雄' },
    { text: '我要當宇宙之王', expected: 'pass', description: '宇宙之王' },
    { text: '我想做量子物理學家', expected: 'pass', description: '量子物理學家' },
    { text: '我要成為時空旅行者', expected: 'pass', description: '時空旅行者' },
    
    // 傳統職業 - 應該通過
    { text: '我想當醫生', expected: 'pass', description: '醫生' },
    { text: '我要做老師', expected: 'pass', description: '老師' },
    { text: '我想成為工程師', expected: 'pass', description: '工程師' },
    { text: '我要當設計師', expected: 'pass', description: '設計師' },
    
    // 非法職業 - 應該被拒絕
    { text: '我想當殺手', expected: 'fail', description: '殺手' },
    { text: '我要做強盜', expected: 'fail', description: '強盜' },
    { text: '我想成為毒販', expected: 'fail', description: '毒販' },
    { text: '我要當恐怖分子', expected: 'fail', description: '恐怖分子' },
    
    // 無職業 - 應該被拒絕
    { text: '今天天氣很好', expected: 'fail', description: '無職業' },
    { text: '我想吃飯', expected: 'fail', description: '無職業' },
    { text: '我要睡覺', expected: 'fail', description: '無職業' }
  ];
  
  console.log('📋 開始測試...\n');
  
  for (const testCase of testCases) {
    try {
      console.log(`🔍 測試: ${testCase.description}`);
      console.log(`📝 輸入: "${testCase.text}"`);
      
      const response = await axios.post('http://localhost:5001/api/profession/validate', {
        text: testCase.text,
        sessionId: 'test-session-' + Date.now()
      }, {
        timeout: 10000
      });
      
      const result = response.data;
      
      if (testCase.expected === 'pass') {
        if (result.valid) {
          console.log(`✅ 通過 - 職業: ${result.profession}`);
        } else {
          console.log(`❌ 失敗 - 應該通過但被拒絕: ${result.message}`);
        }
      } else {
        if (!result.valid) {
          console.log(`✅ 正確拒絕 - ${result.message}`);
        } else {
          console.log(`❌ 失敗 - 應該被拒絕但通過了: ${result.profession}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ 測試失敗: ${error.message}`);
    }
    
    console.log('---');
    await new Promise(resolve => setTimeout(resolve, 500)); // 等待一下
  }
  
  console.log('\n🎯 測試完成！');
  console.log('\n💡 新的驗證邏輯:');
  console.log('- ✅ 只排除真正非法的職業');
  console.log('- ✅ 允許所有創意和夢想職業');
  console.log('- ✅ 包括太空人、特首、總統等');
  console.log('- ✅ 包括虛構職業如超級英雄、宇宙之王等');
  console.log('- ❌ 拒絕殺手、強盜、毒販等非法職業');
}

testProfessionValidation();
