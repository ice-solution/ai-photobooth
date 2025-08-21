const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// 職業提示詞模板（中性模板，根據性別動態調整）
const PROFESSION_PROMPTS = {
  // 傳統職業
  '醫生': 'young asian {gender} doctor in white coat, medical setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-25, fresh graduate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '護士': 'young asian {gender} nurse in uniform, healthcare setting, caring expression, front facing, looking directly at camera, youthful appearance, age 18-25, fresh graduate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '教師': 'young asian {gender} teacher in classroom, educational setting, warm smile, front facing, looking directly at camera, youthful appearance, age 20-28, energetic, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '律師': 'young asian {gender} lawyer in business suit, court setting, confident pose, front facing, looking directly at camera, youthful appearance, age 22-30, fresh graduate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '工程師': 'young asian {gender} engineer in office, technical setting, focused expression, front facing, looking directly at camera, youthful appearance, age 20-28, tech-savvy, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '設計師': 'young asian {gender} designer in creative studio, artistic setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, trendy, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '會計師': 'young asian {gender} accountant in office, financial setting, professional pose, front facing, looking directly at camera, youthful appearance, age 20-28, fresh graduate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '建築師': 'young asian {gender} architect with blueprints, construction setting, confident pose, front facing, looking directly at camera, youthful appearance, age 22-30, creative, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '警察': 'young asian {gender} police officer in uniform, law enforcement setting, authoritative pose, front facing, looking directly at camera, youthful appearance, age 20-28, strong, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '消防員': 'young asian {gender} firefighter in uniform, fire station setting, brave pose, front facing, looking directly at camera, youthful appearance, age 20-28, heroic, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '軍人': 'young asian {gender} soldier in uniform, military setting, disciplined pose, front facing, looking directly at camera, youthful appearance, age 18-26, strong, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '飛行員': 'young asian {gender} pilot in uniform, cockpit setting, confident pose, front facing, looking directly at camera, youthful appearance, age 22-30, adventurous, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '廚師': 'young asian {gender} chef in kitchen uniform, kitchen setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, passionate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '攝影師': 'young asian {gender} photographer with camera, studio setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, creative, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '藝術家': 'young asian {gender} artist in studio, creative setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, expressive, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '音樂家': 'young asian {gender} musician with instrument, concert setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, passionate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '演員': 'young asian {gender} actor on stage, theater setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, expressive, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '運動員': 'young asian {gender} athlete in sports uniform, stadium setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, energetic, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '科學家': 'young asian {gender} scientist in laboratory, research setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, curious, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '記者': 'young asian {gender} journalist with microphone, news setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, dynamic, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  
  // 創意和夢想職業
  '太空人': 'young asian {gender} astronaut in space suit, space station setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-30, adventurous, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '幼兒老師': 'young asian {gender} kindergarten teacher in classroom, colorful educational setting, warm smile, front facing, looking directly at camera, youthful appearance, age 20-28, caring, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '遊戲設計師': 'young asian {gender} game designer in modern office, gaming studio setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, tech-savvy, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '動畫師': 'young asian {gender} animator in creative studio, animation setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, creative, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '電影導演': 'young asian {gender} film director on movie set, cinematic setting, confident pose, front facing, looking directly at camera, youthful appearance, age 22-30, visionary, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '漫畫家': 'young asian {gender} comic artist in studio, creative workspace, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, imaginative, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '電競選手': 'young asian {gender} esports player in gaming setup, modern gaming room, confident pose, front facing, looking directly at camera, youthful appearance, age 18-24, competitive, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  'YouTuber': 'young asian {gender} YouTuber in modern studio, content creation setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, charismatic, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '程式設計師': 'young asian {gender} programmer in tech office, coding environment, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, tech-savvy, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '創業家': 'young asian {gender} entrepreneur in modern office, startup setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, ambitious, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '海洋生物學家': 'young asian {gender} marine biologist in research facility, ocean setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, adventurous, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '考古學家': 'young asian {gender} archaeologist in excavation site, ancient ruins setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, curious, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '獸醫': 'young asian {gender} veterinarian in animal clinic, veterinary setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, compassionate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '心理學家': 'young asian {gender} psychologist in modern office, therapy setting, confident pose, front facing, looking directly at camera, youthful appearance, age 22-30, empathetic, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '環境科學家': 'young asian {gender} environmental scientist in research lab, nature setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, passionate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '機器人工程師': 'young asian {gender} robotics engineer in advanced lab, futuristic setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, tech-savvy, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  'AI研究員': 'young asian {gender} AI researcher in modern laboratory, high-tech setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, innovative, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '時裝設計師': 'young asian {gender} fashion designer in creative studio, fashion setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, trendy, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '珠寶設計師': 'young asian {gender} jewelry designer in workshop, creative studio, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, creative, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting',
  '咖啡師': 'young asian {gender} barista in modern cafe, coffee shop setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-26, enthusiastic, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting'
};

// 生成職業照
router.post('/profession-photo', async (req, res) => {
  try {
    const { profession, gender, sessionId } = req.body;

    if (!profession) {
      return res.status(400).json({ error: '沒有提供職業資訊' });
    }

    if (!gender || !['male', 'female'].includes(gender)) {
      return res.status(400).json({ error: '請提供有效的性別資訊 (male/female)' });
    }

    // 更新使用者狀態
    let user = await User.findOne({ sessionId });
    if (user) {
      user.status = 'generating';
      await user.save();
    }

    // 獲取職業提示詞並根據性別調整
    let prompt = PROFESSION_PROMPTS[profession];
    if (!prompt) {
      // 如果沒有預設提示詞，使用通用模板（根據性別）
      const genderText = gender === 'male' ? 'male' : 'female';
      prompt = `young asian ${genderText} ${profession} in work environment, professional setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-28, fresh graduate, half body portrait, professional headshot, asian features, asian ethnicity, ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting`;
    } else {
      // 使用模板替換 {gender} 佔位符
      prompt = prompt.replace(/{gender}/g, gender);
    }

    // 負面提示詞（根據性別調整，避免錯誤性別、側面照、年長者等）
    let negativePrompt = 'blurry, low quality, distorted, unrealistic, cartoon, anime, painting, sketch, watermark, text, logo, signature, side profile, side view, looking away, closed eyes, sunglasses, hat, mask, old, elderly, senior, wrinkled, gray hair, bald, middle-aged, mature, caucasian, white, black, hispanic, african, european, american, non-asian';
    
    // 根據性別添加對應的負面提示詞
    if (gender === 'male') {
      negativePrompt += ', female, woman, girl';
    } else if (gender === 'female') {
      negativePrompt += ', male, man, boy';
    }

    // 詳細記錄 Stability AI 請求資訊
    console.log('\n🎨 Stability AI 請求詳情:');
    console.log('📝 職業:', profession);
    console.log('👤 性別:', gender);
    console.log('📝 正面提示詞:', prompt);
    console.log('📝 負面提示詞:', negativePrompt);
    console.log('📐 圖片尺寸:', '896x1152');
    console.log('⚙️ CFG Scale:', 8);
    console.log('🔄 Steps:', 50);
    console.log('🎭 Style Preset:', 'photographic');

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
      cfg_scale: 8,  // 提高 CFG scale 以獲得更好的質量
      height: 1152,  // 使用支持的解析度 896x1152
      width: 896,
      samples: 1,
      steps: 50,  // 增加步數以提高質量
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
    const filename = `generated_${sessionId}_${Date.now()}.png`;
    const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
    
    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    const filepath = path.join(uploadPath, filename);
    fs.writeFileSync(filepath, imageBuffer);

    // 詳細記錄 Stability AI 返回的圖片資訊
    const sharp = require('sharp');
    const stabilityMetadata = await sharp(filepath).metadata();
    console.log('\n📊 Stability AI 返回圖片詳情:');
    console.log('📁 檔案路徑:', filepath);
    console.log('📐 實際尺寸:', `${stabilityMetadata.width}x${stabilityMetadata.height}`);
    console.log('🎨 格式:', stabilityMetadata.format);
    console.log('🌈 色彩空間:', stabilityMetadata.space);
    console.log('📊 通道數:', stabilityMetadata.channels);
    console.log('💾 檔案大小:', `${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    console.log('✅ Stability AI 圖片生成完成');

    // 更新使用者資料
    if (user) {
      user.generatedPhoto = `/uploads/${filename}`;
      user.gender = gender; // 保存性別資訊
      user.status = 'faceswapping';
      await user.save();
    }

    res.json({
      success: true,
      imageUrl: `/uploads/${filename}`,
      message: '職業照生成成功'
    });

  } catch (error) {
    console.error('圖片生成錯誤:', error);
    
    // 更新使用者狀態為錯誤
    if (req.body.sessionId) {
      let user = await User.findOne({ sessionId: req.body.sessionId });
      if (user) {
        user.status = 'error';
        await user.save();
      }
    }

    res.status(500).json({
      error: '圖片生成失敗',
      details: error.message
    });
  }
});

// 獲取生成狀態
router.get('/status/:sessionId', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(404).json({ error: '找不到該會話' });
    }

    res.json({
      status: user.status,
      generatedPhoto: user.generatedPhoto,
      finalPhoto: user.finalPhoto
    });
  } catch (error) {
    res.status(500).json({ error: '獲取狀態失敗' });
  }
});

module.exports = router;
