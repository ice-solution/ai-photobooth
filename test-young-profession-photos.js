const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testYoungProfessionPhotos() {
  console.log('🧪 測試年輕化職業照生成...');
  
  try {
    // 測試幾個不同的職業
    const testProfessions = ['醫生', '工程師', '教師', '設計師', '運動員'];
    
    for (const profession of testProfessions) {
      console.log(`\n🎯 測試職業: ${profession}`);
      
      // 構建提示詞
      const prompt = `young male ${profession} in work environment, professional setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-28, fresh graduate, high quality, detailed, realistic, natural lighting, inspiring for teenagers`;
      
      const negativePrompt = 'blurry, low quality, distorted, unrealistic, cartoon, anime, painting, sketch, watermark, text, logo, signature, female, woman, girl, side profile, side view, looking away, closed eyes, sunglasses, hat, mask, old, elderly, senior, wrinkled, gray hair, bald, middle-aged, mature';
      
      console.log('📝 提示詞:', prompt);
      console.log('❌ 負面提示詞:', negativePrompt);
      
      // 調用 Stability AI API
      const response = await axios.post(process.env.STABILITY_API_URL, {
        text_prompts: [
          {
            text: prompt,
            weight: 1
          },
          {
            text: negativePrompt,
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
        style_preset: "photographic"
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.data.artifacts || response.data.artifacts.length === 0) {
        console.log('❌ 沒有生成圖片');
        continue;
      }

      // 儲存生成的圖片
      const imageData = response.data.artifacts[0];
      const imageBuffer = Buffer.from(imageData.base64, 'base64');
      const filename = `young_${profession}_${Date.now()}.png`;
      const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
      
      // 確保目錄存在
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      const filepath = path.join(uploadPath, filename);
      fs.writeFileSync(filepath, imageBuffer);
      
      console.log('✅ 年輕化職業照生成成功');
      console.log('📁 文件路徑:', filepath);
      console.log('📊 文件大小:', (imageBuffer.length / 1024).toFixed(2), 'KB');
      
      // 等待一下再生成下一張
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n🎉 所有年輕化職業照測試完成！');
    console.log('📋 生成的職業照特點:');
    console.log('- 年齡範圍: 18-28歲');
    console.log('- 年輕外觀: youthful appearance');
    console.log('- 新鮮畢業生: fresh graduate');
    console.log('- 激勵青少年: inspiring for teenagers');
    console.log('- 避免年長者: 負面提示詞包含 old, elderly, senior 等');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    
    if (error.response?.data) {
      console.error('API 錯誤詳情:', error.response.data);
    }
  }
}

// 檢查環境變數
if (!process.env.STABILITY_API_KEY) {
  console.error('❌ 請設定 STABILITY_API_KEY 環境變數');
  process.exit(1);
}

if (!process.env.STABILITY_API_URL) {
  console.error('❌ 請設定 STABILITY_API_URL 環境變數');
  process.exit(1);
}

testYoungProfessionPhotos();
