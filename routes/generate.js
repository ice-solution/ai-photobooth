const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// 職業提示詞模板（年輕男性半身照 - 9:16 比例，適合青少年和小孩，包含創意職業）
const PROFESSION_PROMPTS = {
  // 傳統職業
  '醫生': 'young male doctor in white coat, medical setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-25, fresh graduate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '護士': 'young male nurse in uniform, healthcare setting, caring expression, front facing, looking directly at camera, youthful appearance, age 18-25, fresh graduate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '教師': 'young male teacher in classroom, educational setting, warm smile, front facing, looking directly at camera, youthful appearance, age 20-28, energetic, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '律師': 'young male lawyer in business suit, court setting, confident pose, front facing, looking directly at camera, youthful appearance, age 22-30, fresh graduate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '工程師': 'young male engineer in office, technical setting, focused expression, front facing, looking directly at camera, youthful appearance, age 20-28, tech-savvy, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '設計師': 'young male designer in creative studio, artistic setting, creative pose, front facing, looking directly at camera, youthful appearance, age 18-26, trendy, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '會計師': 'young male accountant in office, financial setting, professional pose, front facing, looking directly at camera, youthful appearance, age 20-28, fresh graduate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '建築師': 'young male architect with blueprints, construction setting, thoughtful pose, front facing, looking directly at camera, youthful appearance, age 22-30, creative, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '警察': 'young male police officer in uniform, law enforcement setting, authoritative pose, front facing, looking directly at camera, youthful appearance, age 20-28, strong, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '消防員': 'young male firefighter in uniform, fire station setting, brave pose, front facing, looking directly at camera, youthful appearance, age 20-28, heroic, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '軍人': 'young male soldier in uniform, military setting, disciplined pose, front facing, looking directly at camera, youthful appearance, age 18-26, strong, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '飛行員': 'young male pilot in uniform, cockpit setting, confident pose, front facing, looking directly at camera, youthful appearance, age 22-30, adventurous, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '廚師': 'young male chef in kitchen uniform, kitchen setting, culinary pose, front facing, looking directly at camera, youthful appearance, age 18-26, passionate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '攝影師': 'young male photographer with camera, studio setting, artistic pose, front facing, looking directly at camera, youthful appearance, age 18-26, creative, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '藝術家': 'young male artist in studio, creative setting, artistic pose, front facing, looking directly at camera, youthful appearance, age 18-26, expressive, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '音樂家': 'young male musician with instrument, concert setting, musical pose, front facing, looking directly at camera, youthful appearance, age 18-26, passionate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '演員': 'young male actor on stage, theater setting, dramatic pose, front facing, looking directly at camera, youthful appearance, age 18-26, expressive, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '運動員': 'young male athlete in sports uniform, stadium setting, athletic pose, front facing, looking directly at camera, youthful appearance, age 18-26, energetic, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '科學家': 'young male scientist in laboratory, research setting, focused pose, front facing, looking directly at camera, youthful appearance, age 20-28, curious, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '記者': 'young male journalist with microphone, news setting, professional pose, front facing, looking directly at camera, youthful appearance, age 20-28, dynamic, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  
  // 創意和夢想職業
  '太空人': 'young male astronaut in space suit, space station setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-30, adventurous, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '幼兒老師': 'young male kindergarten teacher in classroom, colorful educational setting, warm smile, front facing, looking directly at camera, youthful appearance, age 20-28, caring, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '遊戲設計師': 'young male game designer in modern office, gaming studio setting, creative pose, front facing, looking directly at camera, youthful appearance, age 18-26, tech-savvy, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '動畫師': 'young male animator in creative studio, animation setting, artistic pose, front facing, looking directly at camera, youthful appearance, age 18-26, creative, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '電影導演': 'young male film director on movie set, cinematic setting, confident pose, front facing, looking directly at camera, youthful appearance, age 22-30, visionary, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '漫畫家': 'young male comic artist in studio, creative workspace, artistic pose, front facing, looking directly at camera, youthful appearance, age 18-26, imaginative, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '電競選手': 'young male esports player in gaming setup, modern gaming room, focused pose, front facing, looking directly at camera, youthful appearance, age 18-24, competitive, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  'YouTuber': 'young male YouTuber in modern studio, content creation setting, energetic pose, front facing, looking directly at camera, youthful appearance, age 18-26, charismatic, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '程式設計師': 'young male programmer in tech office, coding environment, focused expression, front facing, looking directly at camera, youthful appearance, age 18-26, tech-savvy, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '創業家': 'young male entrepreneur in modern office, startup setting, confident pose, front facing, looking directly at camera, youthful appearance, age 20-28, ambitious, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '海洋生物學家': 'young male marine biologist in research facility, ocean setting, curious pose, front facing, looking directly at camera, youthful appearance, age 20-28, adventurous, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '考古學家': 'young male archaeologist in excavation site, ancient ruins setting, exploratory pose, front facing, looking directly at camera, youthful appearance, age 20-28, curious, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '獸醫': 'young male veterinarian in animal clinic, veterinary setting, caring pose, front facing, looking directly at camera, youthful appearance, age 20-28, compassionate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '心理學家': 'young male psychologist in modern office, therapy setting, understanding pose, front facing, looking directly at camera, youthful appearance, age 22-30, empathetic, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '環境科學家': 'young male environmental scientist in research lab, nature setting, focused pose, front facing, looking directly at camera, youthful appearance, age 20-28, passionate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '機器人工程師': 'young male robotics engineer in advanced lab, futuristic setting, innovative pose, front facing, looking directly at camera, youthful appearance, age 20-28, tech-savvy, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  'AI研究員': 'young male AI researcher in modern laboratory, high-tech setting, focused expression, front facing, looking directly at camera, youthful appearance, age 20-28, innovative, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '時裝設計師': 'young male fashion designer in creative studio, fashion setting, stylish pose, front facing, looking directly at camera, youthful appearance, age 18-26, trendy, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '珠寶設計師': 'young male jewelry designer in workshop, creative studio, artistic pose, front facing, looking directly at camera, youthful appearance, age 18-26, creative, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers',
  '咖啡師': 'young male barista in modern cafe, coffee shop setting, passionate pose, front facing, looking directly at camera, youthful appearance, age 18-26, enthusiastic, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers'
};

// 生成職業照
router.post('/profession-photo', async (req, res) => {
  try {
    const { profession, sessionId } = req.body;

    if (!profession) {
      return res.status(400).json({ error: '沒有提供職業資訊' });
    }

    // 更新使用者狀態
    let user = await User.findOne({ sessionId });
    if (user) {
      user.status = 'generating';
      await user.save();
    }

    // 獲取職業提示詞
    let prompt = PROFESSION_PROMPTS[profession];
    if (!prompt) {
      // 如果沒有預設提示詞，使用通用模板（年輕男性半身照）
      prompt = `young male ${profession} in work environment, professional setting, confident pose, front facing, looking directly at camera, youthful appearance, age 18-28, fresh graduate, half body portrait, professional headshot, high quality, detailed, realistic, natural lighting, inspiring for teenagers`;
    }

    // 負面提示詞（避免女性、側面照、年長者等）
    const negativePrompt = 'blurry, low quality, distorted, unrealistic, cartoon, anime, painting, sketch, watermark, text, logo, signature, female, woman, girl, side profile, side view, looking away, closed eyes, sunglasses, hat, mask, old, elderly, senior, wrinkled, gray hair, bald, middle-aged, mature';

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
    const filename = `generated_${sessionId}_${Date.now()}.png`;
    const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
    
    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    const filepath = path.join(uploadPath, filename);
    fs.writeFileSync(filepath, imageBuffer);

    // 更新使用者資料
    if (user) {
      user.generatedPhoto = `/uploads/${filename}`;
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
