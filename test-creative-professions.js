const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testCreativeProfessions() {
  console.log('🧪 測試創意職業生成...');
  
  try {
    // 測試創意職業
    const creativeProfessions = [
      '太空人',
      '幼兒老師', 
      '遊戲設計師',
      '動畫師',
      '電影導演',
      '漫畫家',
      '電競選手',
      'YouTuber',
      '程式設計師',
      '創業家',
      '海洋生物學家',
      '考古學家',
      '獸醫',
      '心理學家',
      '環境科學家',
      '機器人工程師',
      'AI研究員',
      '時裝設計師',
      '珠寶設計師',
      '咖啡師'
    ];
    
    console.log(`📋 測試 ${creativeProfessions.length} 個創意職業`);
    
    // 選擇幾個代表性職業進行測試
    const testProfessions = ['太空人', '幼兒老師', '遊戲設計師', '電競選手', 'AI研究員'];
    
    for (const profession of testProfessions) {
      console.log(`\n🎯 測試創意職業: ${profession}`);
      
      // 構建提示詞
      const prompt = `young male ${profession} in work environment, professional setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-28, fresh graduate, high quality, detailed, realistic, natural lighting, inspiring for teenagers`;
      
      const negativePrompt = 'blurry, low quality, distorted, unrealistic, cartoon, anime, painting, sketch, watermark, text, logo, signature, female, woman, girl, side profile, side view, looking away, closed eyes, sunglasses, hat, mask, old, elderly, senior, wrinkled, gray hair, bald, middle-aged, mature';
      
      console.log('📝 提示詞:', prompt);
      
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
      const filename = `creative_${profession}_${Date.now()}.png`;
      const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
      
      // 確保目錄存在
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      const filepath = path.join(uploadPath, filename);
      fs.writeFileSync(filepath, imageBuffer);
      
      console.log('✅ 創意職業照生成成功');
      console.log('📁 文件路徑:', filepath);
      console.log('📊 文件大小:', (imageBuffer.length / 1024).toFixed(2), 'KB');
      
      // 等待一下再生成下一張
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n🎉 創意職業測試完成！');
    console.log('📋 新增的創意職業:');
    console.log('- 太空人: 太空探索夢想');
    console.log('- 幼兒老師: 教育啟蒙');
    console.log('- 遊戲設計師: 數位創意');
    console.log('- 電競選手: 競技夢想');
    console.log('- AI研究員: 未來科技');
    console.log('- 電影導演: 藝術創作');
    console.log('- 漫畫家: 視覺藝術');
    console.log('- YouTuber: 數位內容');
    console.log('- 創業家: 商業創新');
    console.log('- 海洋生物學家: 自然探索');
    console.log('- 考古學家: 歷史探索');
    console.log('- 獸醫: 動物關懷');
    console.log('- 心理學家: 心靈關懷');
    console.log('- 環境科學家: 環保使命');
    console.log('- 機器人工程師: 自動化未來');
    console.log('- 時裝設計師: 時尚創意');
    console.log('- 珠寶設計師: 精緻工藝');
    console.log('- 咖啡師: 生活藝術');
    
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

testCreativeProfessions();
