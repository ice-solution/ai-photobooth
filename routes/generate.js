const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// 職業提示詞模板
const PROFESSION_PROMPTS = {
  '醫生': 'professional portrait of a doctor in white coat, medical setting, confident pose, high quality, detailed',
  '護士': 'professional portrait of a nurse in uniform, healthcare setting, caring expression, high quality, detailed',
  '教師': 'professional portrait of a teacher in classroom, educational setting, warm smile, high quality, detailed',
  '律師': 'professional portrait of a lawyer in business suit, court setting, confident pose, high quality, detailed',
  '工程師': 'professional portrait of an engineer in office, technical setting, focused expression, high quality, detailed',
  '設計師': 'professional portrait of a designer in creative studio, artistic setting, creative pose, high quality, detailed',
  '會計師': 'professional portrait of an accountant in office, financial setting, professional pose, high quality, detailed',
  '建築師': 'professional portrait of an architect with blueprints, construction setting, thoughtful pose, high quality, detailed',
  '警察': 'professional portrait of a police officer in uniform, law enforcement setting, authoritative pose, high quality, detailed',
  '消防員': 'professional portrait of a firefighter in uniform, fire station setting, brave pose, high quality, detailed',
  '軍人': 'professional portrait of a soldier in uniform, military setting, disciplined pose, high quality, detailed',
  '飛行員': 'professional portrait of a pilot in uniform, cockpit setting, confident pose, high quality, detailed',
  '廚師': 'professional portrait of a chef in kitchen uniform, kitchen setting, culinary pose, high quality, detailed',
  '攝影師': 'professional portrait of a photographer with camera, studio setting, artistic pose, high quality, detailed',
  '藝術家': 'professional portrait of an artist in studio, creative setting, artistic pose, high quality, detailed',
  '音樂家': 'professional portrait of a musician with instrument, concert setting, musical pose, high quality, detailed',
  '演員': 'professional portrait of an actor on stage, theater setting, dramatic pose, high quality, detailed',
  '運動員': 'professional portrait of an athlete in sports uniform, stadium setting, athletic pose, high quality, detailed',
  '科學家': 'professional portrait of a scientist in laboratory, research setting, focused pose, high quality, detailed',
  '記者': 'professional portrait of a journalist with microphone, news setting, professional pose, high quality, detailed'
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
      // 如果沒有預設提示詞，使用通用模板
      prompt = `professional portrait of a ${profession} in work environment, professional setting, confident pose, high quality, detailed, realistic`;
    }

    // 負面提示詞
    const negativePrompt = 'blurry, low quality, distorted, unrealistic, cartoon, anime, painting, sketch, watermark, text, logo, signature';

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
