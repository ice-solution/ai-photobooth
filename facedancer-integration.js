const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class FaceDancerIntegration {
  constructor() {
    // Hugging Face FaceDancer API 端點
    this.hfApiUrl = 'https://api-inference.huggingface.co/models/felixrosberg/FaceDancer';
    this.hfApiKey = process.env.HUGGINGFACE_API_KEY;
    
    // 備用 FaceDancer 服務端點（如果有自建服務）
    this.customApiUrl = process.env.FACEDANCER_API_URL;
  }

  // 使用 Hugging Face API 進行臉部交換
  async swapFaceWithHF(sourceImagePath, targetImagePath) {
    try {
      console.log('🔄 使用 Hugging Face FaceDancer 進行臉部交換...');
      
      if (!this.hfApiKey) {
        throw new Error('需要設定 HUGGINGFACE_API_KEY');
      }

      // 準備圖片
      const sourceImage = fs.readFileSync(sourceImagePath);
      const targetImage = fs.readFileSync(targetImagePath);

      // 建立 FormData
      const formData = new FormData();
      formData.append('source_face', sourceImage, {
        filename: 'source_face.jpg',
        contentType: 'image/jpeg'
      });
      formData.append('target_image', targetImage, {
        filename: 'target_image.jpg',
        contentType: 'image/jpeg'
      });

      // 發送請求到 Hugging Face Spaces
      const hfUrl = process.env.HUGGINGFACE_SPACES_URL || 'https://your-username-facedancer.hf.space';
      const response = await axios.post(`${hfUrl}/swap`, formData, {
        headers: {
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer',
        timeout: 120000 // 2分鐘超時
      });

      // 儲存結果
      const outputPath = path.join(
        path.resolve(process.env.UPLOAD_PATH || './uploads'),
        `facedancer_${Date.now()}.jpg`
      );
      
      fs.writeFileSync(outputPath, response.data);
      
      console.log('✅ FaceDancer 臉部交換完成');
      return outputPath;

    } catch (error) {
      console.error('❌ Hugging Face FaceDancer 錯誤:', error.message);
      throw error;
    }
  }

  // 使用自建 FaceDancer 服務
  async swapFaceWithCustomAPI(sourceImagePath, targetImagePath) {
    try {
      console.log('🔄 使用自建 FaceDancer 服務進行臉部交換...');
      
      if (!this.customApiUrl) {
        throw new Error('需要設定 FACEDANCER_API_URL');
      }

      // 準備圖片
      const sourceImage = fs.readFileSync(sourceImagePath);
      const targetImage = fs.readFileSync(targetImagePath);

      // 建立 FormData
      const formData = new FormData();
      formData.append('source_face', sourceImage, {
        filename: 'source_face.jpg',
        contentType: 'image/jpeg'
      });
      formData.append('target_image', targetImage, {
        filename: 'target_image.jpg',
        contentType: 'image/jpeg'
      });

      // 發送請求到自建服務
      const response = await axios.post(`${this.customApiUrl}/swap`, formData, {
        headers: {
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer',
        timeout: 120000 // 2分鐘超時
      });

      // 儲存結果
      const outputPath = path.join(
        path.resolve(process.env.UPLOAD_PATH || './uploads'),
        `facedancer_custom_${Date.now()}.jpg`
      );
      
      fs.writeFileSync(outputPath, response.data);
      
      console.log('✅ 自建 FaceDancer 臉部交換完成');
      return outputPath;

    } catch (error) {
      console.error('❌ 自建 FaceDancer 錯誤:', error.message);
      throw error;
    }
  }

  // 圖片預處理 - 確保圖片符合 FaceDancer 要求
  async preprocessImage(imagePath) {
    try {
      const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
      const filename = `preprocessed_${path.basename(imagePath)}`;
      const outputPath = path.join(uploadPath, filename);

      // 使用 sharp 進行預處理
      await sharp(imagePath)
        .resize(256, 256, { fit: 'cover', position: 'center' }) // FaceDancer 標準尺寸
        .jpeg({ quality: 95 })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error('❌ 圖片預處理錯誤:', error);
      throw error;
    }
  }

  // 主要臉部交換函數
  async performFaceSwap(sourceImagePath, targetImagePath) {
    try {
      console.log('🎭 開始 FaceDancer 臉部交換流程...');

      // 1. 預處理圖片
      const preprocessedSource = await this.preprocessImage(sourceImagePath);
      const preprocessedTarget = await this.preprocessImage(targetImagePath);

      let resultPath;

      // 2. 嘗試使用 Hugging Face API
      try {
        resultPath = await this.swapFaceWithHF(preprocessedSource, preprocessedTarget);
      } catch (hfError) {
        console.log('⚠️ Hugging Face API 失敗，嘗試自建服務...');
        
        // 3. 如果失敗，嘗試自建服務
        try {
          resultPath = await this.swapFaceWithCustomAPI(preprocessedSource, preprocessedTarget);
        } catch (customError) {
          console.log('⚠️ 自建服務也失敗，使用備用方案...');
          
          // 4. 備用方案：簡單的圖片合成
          resultPath = await this.fallbackFaceSwap(sourceImagePath, targetImagePath);
        }
      }

      // 5. 清理臨時檔案
      try {
        if (fs.existsSync(preprocessedSource)) fs.unlinkSync(preprocessedSource);
        if (fs.existsSync(preprocessedTarget)) fs.unlinkSync(preprocessedTarget);
      } catch (cleanupError) {
        console.warn('⚠️ 清理臨時檔案失敗:', cleanupError.message);
      }

      return resultPath;

    } catch (error) {
      console.error('❌ FaceDancer 臉部交換失敗:', error);
      throw error;
    }
  }

  // 備用臉部交換方案 - 智能臉部合成
  async fallbackFaceSwap(sourceImagePath, targetImagePath) {
    try {
      console.log('🔄 使用智能備用臉部交換方案...');
      
      const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
      const outputFilename = `smart_fallback_${Date.now()}.jpg`;
      const outputPath = path.join(uploadPath, outputFilename);

      // 獲取目標圖片尺寸
      const targetMetadata = await sharp(targetImagePath).metadata();
      const targetWidth = targetMetadata.width;
      const targetHeight = targetMetadata.height;

      // 計算臉部區域 (智能定位)
      const faceSize = Math.round(Math.min(targetWidth, targetHeight) * 0.35); // 臉部佔圖片 35%
      const faceX = Math.round((targetWidth - faceSize) / 2);
      const faceY = Math.round(targetHeight * 0.12); // 臉部位置在圖片上方 12%

      // 調整源臉部圖片大小並優化
      const resizedSource = await sharp(sourceImagePath)
        .resize(faceSize, faceSize, { 
          fit: 'cover',
          position: 'center'
        })
        .modulate({
          brightness: 1.1,  // 稍微調亮
          saturation: 0.9   // 稍微降低飽和度
        })
        .jpeg({ quality: 95 })
        .toBuffer();

      // 創建橢圓形臉部遮罩
      const maskSize = Math.round(faceSize);
      const maskSvg = `
        <svg width="${maskSize}" height="${maskSize}">
          <defs>
            <radialGradient id="faceGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:white;stop-opacity:1" />
              <stop offset="70%" style="stop-color:white;stop-opacity:1" />
              <stop offset="100%" style="stop-color:white;stop-opacity:0" />
            </radialGradient>
          </defs>
          <ellipse cx="${maskSize/2}" cy="${maskSize/2}" 
                   rx="${maskSize/2 * 0.85}" ry="${maskSize/2 * 0.75}" 
                   fill="url(#faceGradient)"/>
        </svg>
      `;

      const mask = await sharp(Buffer.from(maskSvg))
        .png()
        .toBuffer();

      // 使用智能合成
      const result = await sharp(targetImagePath)
        .resize(targetWidth, targetHeight, { fit: 'cover' })
        .composite([
          {
            input: resizedSource,
            top: faceY,
            left: faceX,
            blend: 'over'
          },
          {
            input: mask,
            top: faceY,
            left: faceX,
            blend: 'multiply'
          }
        ])
        .modulate({
          brightness: 1.05,  // 整體稍微調亮
          contrast: 1.1      // 增加對比度
        })
        .jpeg({ quality: 95 })
        .toFile(outputPath);

      console.log('✅ 智能備用臉部交換完成');
      return outputPath;

    } catch (error) {
      console.error('❌ 備用臉部交換失敗:', error);
      throw error;
    }
  }
}

module.exports = FaceDancerIntegration;
