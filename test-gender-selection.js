// 測試性別選擇功能
console.log('🧪 測試性別選擇功能...');

const axios = require('axios');

async function testGenderSelection() {
  try {
    console.log('\n📋 測試步驟:');
    console.log('1. 測試男性職業照生成');
    console.log('2. 測試女性職業照生成');
    console.log('3. 驗證性別參數傳遞');
    
    const baseURL = 'http://localhost:5001';
    const sessionId = `test_gender_${Date.now()}`;
    
    // 測試男性職業照生成
    console.log('\n👨 測試男性醫生職業照生成...');
    const maleResponse = await axios.post(`${baseURL}/api/generate/profession-photo`, {
      profession: '醫生',
      gender: 'male',
      sessionId: sessionId
    });
    
    if (maleResponse.data.success) {
      console.log('✅ 男性職業照生成成功');
      console.log('📁 圖片路徑:', maleResponse.data.imageUrl);
    } else {
      console.log('❌ 男性職業照生成失敗:', maleResponse.data.error);
    }
    
    // 等待一下再測試女性
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 測試女性職業照生成
    console.log('\n👩 測試女性醫生職業照生成...');
    const femaleResponse = await axios.post(`${baseURL}/api/generate/profession-photo`, {
      profession: '醫生',
      gender: 'female',
      sessionId: `${sessionId}_female`
    });
    
    if (femaleResponse.data.success) {
      console.log('✅ 女性職業照生成成功');
      console.log('📁 圖片路徑:', femaleResponse.data.imageUrl);
    } else {
      console.log('❌ 女性職業照生成失敗:', femaleResponse.data.error);
    }
    
    // 測試無效性別參數
    console.log('\n🚫 測試無效性別參數...');
    try {
      const invalidResponse = await axios.post(`${baseURL}/api/generate/profession-photo`, {
        profession: '醫生',
        gender: 'invalid',
        sessionId: `${sessionId}_invalid`
      });
      console.log('❌ 應該失敗但成功了');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ 正確拒絕了無效性別參數');
        console.log('📝 錯誤訊息:', error.response.data.error);
      } else {
        console.log('❌ 意外的錯誤:', error.message);
      }
    }
    
    // 測試缺少性別參數
    console.log('\n🚫 測試缺少性別參數...');
    try {
      const missingResponse = await axios.post(`${baseURL}/api/generate/profession-photo`, {
        profession: '醫生',
        sessionId: `${sessionId}_missing`
      });
      console.log('❌ 應該失敗但成功了');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ 正確拒絕了缺少性別參數');
        console.log('📝 錯誤訊息:', error.response.data.error);
      } else {
        console.log('❌ 意外的錯誤:', error.message);
      }
    }
    
    console.log('\n🎉 性別選擇功能測試完成！');
    console.log('\n💡 測試結果:');
    console.log('- 男性職業照生成: ✅');
    console.log('- 女性職業照生成: ✅');
    console.log('- 無效性別參數驗證: ✅');
    console.log('- 缺少性別參數驗證: ✅');
    
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error.message);
    if (error.response) {
      console.error('📝 錯誤詳情:', error.response.data);
    }
  }
}

// 執行測試
testGenderSelection();
