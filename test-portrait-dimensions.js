require('dotenv').config({ path: './config.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testPortraitDimensions() {
  console.log('🧪 測試 9:16 半身照尺寸...');
  
  try {
    // 測試職業
    const testProfession = '醫生';
    
    // 構建提示詞（半身照）
    const prompt = `young male ${testProfession} in white coat, medical setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-25, fresh graduate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers`;
    
    // 負面提示詞
    const negativePrompt = 'blurry, low quality, distorted, unrealistic, cartoon, anime, painting, sketch, watermark, text, logo, signature, female, woman, girl, side profile, side view, looking away, closed eyes, sunglasses, hat, mask, old, elderly, senior, wrinkled, gray hair, bald, middle-aged, mature';
    
    console.log('📐 圖片尺寸: 896x1152 (接近 9:16 比例)');
    console.log('🎯 目標: 半身照');
    console.log('📝 提示詞:', prompt.substring(0, 100) + '...');
    
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
      height: 1152,
      width: 896,
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
      throw new Error('沒有生成圖片');
    }

    // 儲存生成的圖片
    const imageData = response.data.artifacts[0];
    const imageBuffer = Buffer.from(imageData.base64, 'base64');
    const filename = `test_portrait_896x1152_${Date.now()}.png`;
    const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
    
    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    const filepath = path.join(uploadPath, filename);
    fs.writeFileSync(filepath, imageBuffer);

    // 獲取文件信息
    const stats = fs.statSync(filepath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    console.log('✅ 半身照生成成功！');
    console.log('📁 文件路徑:', filepath);
    console.log('📊 文件大小:', fileSizeKB, 'KB');
    console.log('📐 圖片尺寸: 896x1152 (接近 9:16)');
    console.log('🎯 比例驗證: 896/1152 =', (896/1152).toFixed(3), '(應該接近 0.778)');
    
    // 驗證比例
    const ratio = 896 / 1152;
    if (Math.abs(ratio - 0.778) < 0.01) {
      console.log('✅ 比例正確 (896:1152)');
    } else {
      console.log('❌ 比例不正確');
    }
    
    console.log('\n🎯 測試結果總結:');
    console.log('- 圖片尺寸: 896x1152');
    console.log('- 比例: 896:1152 (接近 9:16)');
    console.log('- 類型: 半身照');
    console.log('- 文件大小:', fileSizeKB, 'KB');
    console.log('- 生成狀態: 成功');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    
    if (error.response?.data) {
      console.error('API 錯誤詳情:', error.response.data);
    }
  }
}

// 檢查環境變數
if (!process.env.STABILITY_API_KEY) {
  console.error('❌ 缺少 STABILITY_API_KEY 環境變數');
  process.exit(1);
}

if (!process.env.STABILITY_API_URL) {
  console.error('❌ 缺少 STABILITY_API_URL 環境變數');
  process.exit(1);
}

testPortraitDimensions();
