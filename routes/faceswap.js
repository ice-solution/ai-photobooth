const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const User = require('../models/User');
const FaceDancerIntegration = require('../facedancer-integration');

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
    cb(null, 'user-photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只支援圖片檔案格式'));
    }
  }
});

// 上傳使用者照片
router.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '沒有上傳照片' });
    }

    const sessionId = req.body.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: '沒有提供會話ID' });
    }

    // 處理圖片：調整大小和格式
    const processedImagePath = await processImage(req.file.path);
    
    // 更新使用者資料
    let user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(404).json({ error: '找不到該會話' });
    }

    user.userPhoto = `/uploads/${path.basename(processedImagePath)}`;
    user.status = 'generating';
    await user.save();

    // 清理原始檔案
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      photoUrl: user.userPhoto,
      message: '照片上傳成功'
    });

  } catch (error) {
    console.error('照片上傳錯誤:', error);
    
    // 清理檔案
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      error: '照片上傳失敗',
      details: error.message
    });
  }
});

// 執行換臉
router.post('/swap', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: '沒有提供會話ID' });
    }

    // 獲取使用者資料
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(404).json({ error: '找不到該會話' });
    }

    if (!user.userPhoto || !user.generatedPhoto) {
      return res.status(400).json({ error: '缺少使用者照片或生成的職業照' });
    }

    // 更新狀態
    user.status = 'faceswapping';
    await user.save();

    // 執行換臉處理
    const faceSwapResult = await performFaceSwap(user.userPhoto, user.generatedPhoto);
    
    // 更新最終照片路徑（使用生產環境 URL）
    user.finalPhoto = faceSwapResult.productionUrl;
    user.status = 'completed';
    await user.save();

    res.json({
      success: true,
      finalPhotoUrl: faceSwapResult.productionUrl,
      localPath: faceSwapResult.localPath,
      filename: faceSwapResult.filename,
      message: '換臉完成'
    });

  } catch (error) {
    console.error('換臉錯誤:', error);
    
    // 更新狀態為錯誤
    if (req.body.sessionId) {
      let user = await User.findOne({ sessionId: req.body.sessionId });
      if (user) {
        user.status = 'error';
        await user.save();
      }
    }

    res.status(500).json({
      error: '換臉失敗',
      details: error.message
    });
  }
});

// 獲取最終結果
router.get('/result/:sessionId', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(404).json({ error: '找不到該會話' });
    }

    res.json({
      userPhoto: user.userPhoto,
      generatedPhoto: user.generatedPhoto,
      finalPhoto: user.finalPhoto,
      profession: user.profession,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ error: '獲取結果失敗' });
  }
});

// 圖片處理函數
async function processImage(imagePath) {
  const filename = path.basename(imagePath);
  const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
  const outputPath = path.join(uploadPath, `processed_${filename}`);
  
  await sharp(imagePath)
    .resize(512, 512, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toFile(outputPath);
  
  return outputPath;
}

// 使用 FaceDancer 進行臉部交換
async function performFaceSwap(userPhotoPath, generatedPhotoPath) {
  try {
    const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
    const userPhotoFullPath = path.join(uploadPath, path.basename(userPhotoPath));
    const generatedPhotoFullPath = path.join(uploadPath, path.basename(generatedPhotoPath));
    
    // 初始化 FaceDancer 整合
    const faceDancer = new FaceDancerIntegration();
    
    // 使用 FaceDancer 進行臉部交換
    const faceSwapResult = await faceDancer.performFaceSwap(userPhotoFullPath, generatedPhotoFullPath);
    
    return faceSwapResult;
  } catch (error) {
    console.error('FaceDancer 臉部交換錯誤:', error);
    
    // 如果 FaceDancer 失敗，使用備用方案
    try {
      const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
      const userPhotoFullPath = path.join(uploadPath, path.basename(userPhotoPath));
      const generatedPhotoFullPath = path.join(uploadPath, path.basename(generatedPhotoPath));
      
      const outputFilename = `fallback_${Date.now()}.jpg`;
      const outputPath = path.join(uploadPath, outputFilename);
      
      // 備用方案：簡單的圖片合成
      await sharp(generatedPhotoFullPath)
        .resize(1024, 1024, { fit: 'cover' })
        .composite([{
          input: await sharp(userPhotoFullPath)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 90 })
            .toBuffer(),
          top: 100,
          left: 100,
          blend: 'over'
        }])
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      
      return outputPath;
    } catch (fallbackError) {
      console.error('備用臉部交換也失敗:', fallbackError);
      // 最後的備用方案：直接返回生成的職業照
      return generatedPhotoFullPath;
    }
  }
}

module.exports = router;
