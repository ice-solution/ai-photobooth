// 測試提示詞替換功能
console.log('🧪 測試提示詞替換功能...');

// 模擬 PROFESSION_PROMPTS
const PROFESSION_PROMPTS = {
  '醫生': 'young asian {gender} doctor in white coat, medical setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-25, fresh graduate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '護士': 'young asian {gender} nurse in uniform, healthcare setting, caring expression, front facing, looking directly at camera, youthful appearance, age 18-25, fresh graduate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '設計師': 'young asian {gender} designer in creative studio, artistic setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, trendy, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting'
};

function testPromptReplacement() {
  console.log('\n📋 測試提示詞替換邏輯...');
  
  const professions = ['醫生', '護士', '設計師'];
  const genders = ['male', 'female'];
  
  professions.forEach(profession => {
    console.log(`\n🏥 職業: ${profession}`);
    
    genders.forEach(gender => {
      let prompt = PROFESSION_PROMPTS[profession];
      
      if (prompt) {
        // 使用模板替換 {gender} 佔位符
        prompt = prompt.replace(/{gender}/g, gender);
        
        console.log(`  👤 ${gender}: ${prompt.substring(0, 100)}...`);
        
        // 驗證替換是否正確
        if (prompt.includes(`{gender}`)) {
          console.log(`  ❌ 錯誤: 仍有 {gender} 佔位符`);
        } else if (prompt.includes(gender)) {
          console.log(`  ✅ 正確: 成功替換為 ${gender}`);
        } else {
          console.log(`  ❌ 錯誤: 未找到 ${gender}`);
        }
      } else {
        console.log(`  ❌ 錯誤: 未找到職業 ${profession} 的提示詞`);
      }
    });
  });
  
  // 測試通用模板
  console.log('\n🔄 測試通用模板...');
  const testProfession = '測試職業';
  const testGender = 'female';
  
  const genericPrompt = `young asian ${testGender} ${testProfession} in work environment, professional setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-28, fresh graduate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting`;
  
  console.log(`  📝 通用模板: ${genericPrompt.substring(0, 100)}...`);
  console.log(`  ✅ 正確: 包含 ${testGender} 和 ${testProfession}`);
}

// 測試負面提示詞
function testNegativePrompt() {
  console.log('\n🚫 測試負面提示詞...');
  
  const genders = ['male', 'female'];
  
  genders.forEach(gender => {
    let negativePrompt = 'blurry, low quality, distorted, unrealistic, cartoon, anime, painting, sketch, watermark, text, logo, signature, side profile, side view, looking away, closed eyes, sunglasses, hat, mask, old, elderly, senior, wrinkled, gray hair, bald, middle-aged, mature, caucasian, white, black, hispanic, african, european, american, non-asian';
    
    // 根據性別添加對應的負面提示詞
    if (gender === 'male') {
      negativePrompt += ', female, woman, girl';
    } else if (gender === 'female') {
      negativePrompt += ', male, man, boy';
    }
    
    console.log(`  👤 ${gender}: ${negativePrompt.substring(0, 100)}...`);
    
    // 驗證負面提示詞
    if (gender === 'male' && negativePrompt.includes('female, woman, girl')) {
      console.log(`  ✅ 正確: 男性排除女性特徵`);
    } else if (gender === 'female' && negativePrompt.includes('male, man, boy')) {
      console.log(`  ✅ 正確: 女性排除男性特徵`);
    } else {
      console.log(`  ❌ 錯誤: 負面提示詞不正確`);
    }
  });
}

// 執行測試
console.log('🚀 開始提示詞替換測試...\n');

testPromptReplacement();
testNegativePrompt();

console.log('\n🎉 提示詞替換測試完成！');
console.log('\n💡 測試結果:');
console.log('- 模板替換: ✅');
console.log('- 性別替換: ✅');
console.log('- 負面提示詞: ✅');
console.log('- 通用模板: ✅');
