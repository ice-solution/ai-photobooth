const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const User = require('../models/User');

const router = express.Router();

// 設定 multer 用於檔案上傳
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'voice-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|wav|m4a|ogg|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只支援音訊檔案格式'));
    }
  }
});

// 語音轉文字
router.post('/transcribe', async (req, res) => {
  try {
    const { transcribedText, sessionId: clientSessionId } = req.body;
    
    if (!transcribedText) {
      return res.status(400).json({ error: '沒有提供語音文字' });
    }

    const sessionId = clientSessionId || `session_${Date.now()}`;
    
    // 使用前端傳來的語音轉文字結果
    const text = transcribedText;

    // 儲存或更新使用者資料
    let user = await User.findOne({ sessionId });
    if (!user) {
      user = new User({ sessionId });
    }
    
    user.voiceText = text;
    user.status = 'voice';
    await user.save();

    res.json({
      success: true,
      text: text,
      sessionId: user.sessionId
    });

  } catch (error) {
    console.error('語音轉文字錯誤:', error);
    
    res.status(500).json({
      error: '語音轉文字失敗',
      details: error.message
    });
  }
});

// 獲取語音文字
router.get('/text/:sessionId', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(404).json({ error: '找不到該會話' });
    }

    res.json({
      text: user.voiceText,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ error: '獲取語音文字失敗' });
  }
});

module.exports = router;
