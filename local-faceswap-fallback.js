const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class LocalFaceSwapFallback {
  constructor() {
    this.uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
  }

  async performFaceSwap(sourceImagePath, targetImagePath) {
    console.log('🔄 使用本地 faceswap 備選方案...');
    
    try {
      // 讀取源圖片（用戶照片）
      const sourceImage = await sharp(sourceImagePath);
      const sourceMetadata = await sourceImage.metadata();
      
      // 讀取目標圖片（Stability AI 生成的職業照）
      const targetImage = await sharp(targetImagePath);
      const targetMetadata = await targetImage.metadata();
      
      console.log('📊 圖片信息:');
      console.log(`- 源圖片: ${sourceMetadata.width}x${sourceMetadata.height}`);
      console.log(`- 目標圖片: ${targetMetadata.width}x${targetMetadata.height}`);
      
      // 改進的圖片合成 - 提高面部影響度
      
      // 將源圖片調整為更大的臉部區域（目標圖片的 1/3）
      const faceSize = Math.round(Math.min(targetMetadata.width, targetMetadata.height) / 3);
      const resizedSource = await sourceImage
        .resize(faceSize, faceSize, { fit: 'cover' })
        .modulate({
          brightness: 1.1,  // 稍微調亮
          saturation: 1.05  // 稍微增加飽和度
        })
        .toBuffer();
      
      // 創建橢圓形遮罩，更自然的臉部形狀
      const mask = await sharp({
        create: {
          width: faceSize,
          height: faceSize,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      })
      .composite([{
        input: Buffer.from(`
          <svg>
            <defs>
              <radialGradient id="faceGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:white;stop-opacity:1" />
                <stop offset="70%" style="stop-color:white;stop-opacity:1" />
                <stop offset="100%" style="stop-color:white;stop-opacity:0" />
              </radialGradient>
            </defs>
            <ellipse cx="${faceSize/2}" cy="${faceSize/2}" 
                     rx="${faceSize/2 * 0.85}" ry="${faceSize/2 * 0.75}" 
                     fill="url(#faceGradient)"/>
          </svg>
        `),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer();
      
      // 將臉部合成到目標圖片上，位置更精確
      const faceX = (targetMetadata.width - faceSize) / 2;
      const faceY = targetMetadata.height * 0.15; // 調整到 15% 的位置，更接近臉部位置
      
              const result = await targetImage
          .composite([
            {
              input: resizedSource,
              top: Math.round(faceY),
              left: Math.round(faceX),
              blend: 'over'
            },
            {
              input: mask,
              top: Math.round(faceY),
              left: Math.round(faceX),
              blend: 'multiply'
            }
          ])
          .modulate({
            brightness: 1.05,  // 整體稍微調亮
            contrast: 1.1      // 增加對比度
          })
          .jpeg({ quality: 95 })
          .toBuffer();
      
      // 儲存結果
      const filename = `local_faceswap_${Date.now()}.jpg`;
      const outputPath = path.join(this.uploadPath, filename);
      
      if (!fs.existsSync(this.uploadPath)) {
        fs.mkdirSync(this.uploadPath, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, result);
      
      // 詳細記錄本地備選方案處理後的圖片資訊
      const localMetadata = await sharp(outputPath).metadata();
      console.log('\n📊 本地備選方案處理後圖片詳情:');
      console.log('📁 本地檔案路徑:', outputPath);
      console.log('📐 本地處理後尺寸:', `${localMetadata.width}x${localMetadata.height}`);
      console.log('🎨 本地處理後格式:', localMetadata.format);
      console.log('💾 本地處理後檔案大小:', `${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
      console.log('✅ 本地備選方案圖片處理完成');
      
      console.log('✅ 本地 faceswap 完成');
      console.log(`📁 文件路徑: ${outputPath}`);
      
      // 返回結果
      const isDevelopment = process.env.NODE_ENV === 'development';
      const baseUrl = isDevelopment 
        ? 'http://localhost:5001' 
        : 'https://photobooth-api.ice-solution.hk';
      const imageUrl = `${baseUrl}/uploads/${filename}`;
      
      return {
        localPath: outputPath,
        productionUrl: imageUrl,
        filename: filename,
        method: 'local_fallback'
      };
      
    } catch (error) {
      console.error('❌ 本地 faceswap 失敗:', error.message);
      throw error;
    }
  }
}

module.exports = LocalFaceSwapFallback;
