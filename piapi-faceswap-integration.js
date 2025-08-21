const axios = require('axios');
const fs = require('fs');
const path = require('path');

class PiAPIFaceSwap {
  constructor() {
    this.apiKey = 'dc53dece4a8a9bd4d7694b8403450e84297463ed4ca98a4cbfb7a238761db4dc';
    this.baseUrl = 'https://api.piapi.ai/api/v1';
    this.maxRetries = 3;
    this.retryDelay = 2000; // 2秒
  }

  // 創建臉部交換任務
  async createFaceSwapTask(sourceImagePath, targetImagePath) {
    try {
      console.log('🔄 創建 PiAPI 臉部交換任務...');
      
      // 壓縮圖片以符合 PiAPI 要求
      const sharp = require('sharp');
      
      // 壓縮源圖片
      const sourceBuffer = await sharp(sourceImagePath)
        .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      // 壓縮目標圖片
      const targetBuffer = await sharp(targetImagePath)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      // 將圖片轉換為 base64
      const sourceImageBase64 = sourceBuffer.toString('base64');
      const targetImageBase64 = targetBuffer.toString('base64');
      
      console.log('📊 圖片大小:');
      console.log('- 源圖片:', (sourceBuffer.length / 1024).toFixed(2), 'KB');
      console.log('- 目標圖片:', (targetBuffer.length / 1024).toFixed(2), 'KB');
      
      const requestData = {
        model: "Qubico/image-toolkit",
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
        
        // 4. 儲存結果到本地並返回生產環境 URL
        const filename = `piapi_faceswap_${Date.now()}.jpg`;
        const outputPath = path.join(
          path.resolve(process.env.UPLOAD_PATH || './uploads'),
          filename
        );
        
        fs.writeFileSync(outputPath, imageResponse.data);
        
        // 5. 返回生產環境的 URL
        const productionUrl = `https://photobooth-api.ice-solution.hk/uploads/${filename}`;
        
        console.log('✅ PiAPI 臉部交換完成，結果已儲存');
        console.log('🌐 生產環境 URL:', productionUrl);
        
        return {
          localPath: outputPath,
          productionUrl: productionUrl,
          filename: filename
        };
      } else {
        throw new Error(`沒有找到結果圖片，結果格式: ${JSON.stringify(result)}`);
      }

    } catch (error) {
      console.error('❌ PiAPI 臉部交換失敗:', error.message);
      throw error;
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
