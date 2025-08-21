const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const LocalFaceSwapFallback = require('./local-faceswap-fallback');

class PiAPIFaceSwap {
  constructor() {
    this.apiKey = 'dc53dece4a8a9bd4d7694b8403450e84297463ed4ca98a4cbfb7a238761db4dc';
    this.baseUrl = 'https://api.piapi.ai/api/v1';
    this.maxRetries = 3;
    this.retryDelay = 2000; // 2秒
    this.localFallback = new LocalFaceSwapFallback();
  }

  // 創建臉部交換任務
  async createFaceSwapTask(sourceImagePath, targetImagePath) {
    try {
      console.log('🔄 創建 PiAPI 臉部交換任務...');
      
      // 壓縮圖片以符合 PiAPI 要求
      
      // 壓縮源圖片
      const sourceBuffer = await sharp(sourceImagePath)
        .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      // 壓縮目標圖片（保持 9:16 比例）
      const targetBuffer = await sharp(targetImagePath)
        .resize(896, 1152, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      // 將圖片轉換為 base64
      const sourceImageBase64 = sourceBuffer.toString('base64');
      const targetImageBase64 = targetBuffer.toString('base64');
      
      console.log('📊 圖片大小:');
      console.log('- 源圖片:', (sourceBuffer.length / 1024).toFixed(2), 'KB');
      console.log('- 目標圖片:', (targetBuffer.length / 1024).toFixed(2), 'KB');
      
      const requestData = {
        model: "Qubico/image-toolkit",  // 使用支持的模型
        task_type: "face-swap",
        input: {
          target_image: `data:image/jpeg;base64,${targetImageBase64}`,
          swap_image: `data:image/jpeg;base64,${sourceImageBase64}`
        }
      };

      const response = await axios.post(`${this.baseUrl}/task`, requestData, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data.code === 200) {
        console.log('✅ PiAPI 臉部交換任務創建成功');
        return response.data.data.task_id;
      } else {
        throw new Error(`PiAPI 任務創建失敗: ${response.data.message}`);
      }

    } catch (error) {
      console.error('❌ PiAPI 任務創建錯誤:', error.message);
      throw error;
    }
  }

  // 獲取任務結果
  async getTaskResult(taskId) {
    try {
      console.log('🔄 獲取 PiAPI 任務結果...');
      
      const response = await axios.get(`${this.baseUrl}/task/${taskId}`, {
        headers: {
          'x-api-key': this.apiKey
        },
        timeout: 30000
      });

      if (response.data.code === 200) {
        const taskData = response.data.data;
        console.log(`📊 任務狀態: ${taskData.status}`);
        
        if (taskData.status === 'completed') {
          console.log('✅ PiAPI 臉部交換完成');
          return taskData.output;
        } else if (taskData.status === 'failed') {
          throw new Error(`任務失敗: ${taskData.error?.message || '未知錯誤'}`);
        } else {
          // 任務仍在進行中
          return null;
        }
      } else {
        throw new Error(`獲取任務結果失敗: ${response.data.message}`);
      }

    } catch (error) {
      console.error('❌ 獲取任務結果錯誤:', error.message);
      throw error;
    }
  }

  // 等待任務完成
  async waitForTaskCompletion(taskId, maxWaitTime = 120000) { // 2分鐘
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const result = await this.getTaskResult(taskId);
        if (result) {
          return result;
        }
        
        // 等待 3 秒後重試
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error('❌ 等待任務完成時出錯:', error.message);
        throw error;
      }
    }
    
    throw new Error('任務超時');
  }

  // 執行臉部交換
  async performFaceSwap(sourceImagePath, targetImagePath) {
    try {
      console.log('🎭 開始 PiAPI 臉部交換流程...');
      
      // 1. 創建任務
      const taskId = await this.createFaceSwapTask(sourceImagePath, targetImagePath);
      
      // 2. 等待任務完成
      const result = await this.waitForTaskCompletion(taskId);
      
      // 3. 處理結果圖片
      console.log('📊 處理 PiAPI 結果:');
      console.log('- 結果類型:', typeof result);
      console.log('- 結果鍵:', result ? Object.keys(result) : 'null');
      console.log('- 完整結果:', JSON.stringify(result, null, 2));
      
      let imageUrl = null;
      
      // 檢查不同的結果格式
      if (result && result.image_url) {
        imageUrl = result.image_url;
      } else if (result && result.images && result.images.length > 0) {
        imageUrl = result.images[0];
      } else if (result && result.image) {
        imageUrl = result.image;
      } else if (result && result.url) {
        imageUrl = result.url;
      } else if (result && result.output && result.output.images && result.output.images.length > 0) {
        imageUrl = result.output.images[0];
      } else if (result && result.output && result.output.image) {
        imageUrl = result.output.image;
      } else if (result && result.output && result.output.url) {
        imageUrl = result.output.url;
      }
      
      if (imageUrl) {
        console.log('🖼️ 下載結果圖片:', imageUrl);
        
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 30000
        });
        
        // 詳細記錄 PiAPI 原始返回的圖片資訊
        const originalPiAPIImagePath = path.join(
          path.resolve(process.env.UPLOAD_PATH || './uploads'),
          `original_piapi_${Date.now()}.jpg`
        );
        fs.writeFileSync(originalPiAPIImagePath, imageResponse.data);
        
        const originalMetadata = await sharp(originalPiAPIImagePath).metadata();
        console.log('\n📊 PiAPI 原始返回圖片詳情:');
        console.log('📁 原始檔案路徑:', originalPiAPIImagePath);
        console.log('📐 原始尺寸:', `${originalMetadata.width}x${originalMetadata.height}`);
        console.log('🎨 原始格式:', originalMetadata.format);
        console.log('💾 原始檔案大小:', `${(fs.statSync(originalPiAPIImagePath).size / 1024).toFixed(2)} KB`);
        
        // 4. 儲存結果到本地並返回生產環境 URL
        const filename = `piapi_faceswap_${Date.now()}.jpg`;
        const outputPath = path.join(
          path.resolve(process.env.UPLOAD_PATH || './uploads'),
          filename
        );
        
        // 4. 智能處理 PiAPI 返回的圖片
        // 檢查 PiAPI 返回的圖片尺寸
        const originalImageMetadata = await sharp(imageResponse.data).metadata();
        console.log('\n🔍 PiAPI 返回圖片分析:');
        console.log(`- 原始尺寸: ${originalImageMetadata.width}x${originalImageMetadata.height}`);
        
        let finalBuffer;
        
        if (originalImageMetadata.width === 256 && originalImageMetadata.height === 256) {
          // 如果是 256x256，需要處理
          console.log('🔄 檢測到 256x256 圖片，進行尺寸處理...');
          
          // 先將 256x256 放大到 896x896 (保持正方形)
          const squareBuffer = await sharp(imageResponse.data)
            .resize(896, 896, {
              kernel: sharp.kernel.lanczos3,
              fit: 'fill'
            })
            .toBuffer();
          
          // 然後創建 896x1152 的畫布，將正方形圖片垂直居中
          finalBuffer = await sharp({
            create: {
              width: 896,
              height: 1152,
              channels: 3,
              background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
          })
          .composite([{
            input: squareBuffer,
            top: Math.floor((1152 - 896) / 2),
            left: 0,
            blend: 'over'
          }])
          .jpeg({ quality: 98 })
          .toBuffer();
          
        } else if (originalImageMetadata.width === 896 && originalImageMetadata.height === 1152) {
          // 如果已經是正確尺寸，直接使用
          console.log('✅ PiAPI 返回正確尺寸，直接使用');
          finalBuffer = await sharp(imageResponse.data)
            .jpeg({ quality: 98 })
            .toBuffer();
          
        } else {
          // 其他尺寸，調整到目標尺寸
          console.log(`🔄 調整圖片尺寸從 ${originalImageMetadata.width}x${originalImageMetadata.height} 到 896x1152`);
          finalBuffer = await sharp(imageResponse.data)
            .resize(896, 1152, {
              kernel: sharp.kernel.lanczos3,
              fit: 'cover'
            })
            .jpeg({ quality: 98 })
            .toBuffer();
        }
        
        fs.writeFileSync(outputPath, finalBuffer);
        
        // 詳細記錄 PiAPI 處理後的圖片資訊
        const processedMetadata = await sharp(outputPath).metadata();
        console.log('\n📊 PiAPI 處理後圖片詳情:');
        console.log('📁 處理後檔案路徑:', outputPath);
        console.log('📐 處理後尺寸:', `${processedMetadata.width}x${processedMetadata.height}`);
        console.log('🎨 處理後格式:', processedMetadata.format);
        console.log('💾 處理後檔案大小:', `${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
        console.log('✅ PiAPI 圖片處理完成');
        
        // 5. 根據環境返回正確的 URL
        const isDevelopment = process.env.NODE_ENV === 'development';
        const baseUrl = isDevelopment 
          ? 'http://localhost:5001' 
          : 'https://photobooth-api.ice-solution.hk';
        const finalImageUrl = `${baseUrl}/uploads/${filename}`;
        
        console.log('✅ PiAPI 臉部交換完成，結果已儲存');
        console.log(`🌐 ${isDevelopment ? '開發環境' : '生產環境'} URL:`, finalImageUrl);
        
        return {
          localPath: outputPath,
          productionUrl: finalImageUrl,
          filename: filename
        };
      } else {
        throw new Error(`沒有找到結果圖片，結果格式: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error('❌ PiAPI 臉部交換失敗:', error.message);
      
      // 如果 PiAPI 失敗，使用改進的本地備選方案
      console.log('🔄 使用改進的本地 faceswap 備選方案...');
      console.log('💡 本地方案已優化：更大的臉部區域、橢圓形遮罩、更好的顏色調整');
      
      try {
        const fallbackResult = await this.localFallback.performFaceSwap(sourceImagePath, targetImagePath);
        console.log('✅ 本地備選方案成功完成');
        return fallbackResult;
      } catch (fallbackError) {
        console.error('❌ 本地備選方案也失敗:', fallbackError.message);
        throw new Error(`PiAPI 和本地備選方案都失敗: ${error.message}, ${fallbackError.message}`);
      }
    }
  }

  // 重試機制
  async performFaceSwapWithRetry(sourceImagePath, targetImagePath) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 嘗試第 ${attempt} 次 PiAPI 臉部交換...`);
        return await this.performFaceSwap(sourceImagePath, targetImagePath);
      } catch (error) {
        console.error(`❌ 第 ${attempt} 次嘗試失敗:`, error.message);
        
        if (attempt === this.maxRetries) {
          throw error;
        }
        
        console.log(`⏳ 等待 ${this.retryDelay}ms 後重試...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }
}

module.exports = PiAPIFaceSwap;
