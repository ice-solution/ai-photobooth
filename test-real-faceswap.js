const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function testRealFaceSwap() {
  console.log('🧪 測試真實臉部交換效果...');
  
  try {
    // 創建更真實的測試圖片
    const sharp = require('sharp');
    
    // 創建源臉部圖片（模擬人臉）
    const sourceImagePath = path.join(__dirname, 'uploads', 'source_face.jpg');
    if (!fs.existsSync(sourceImagePath)) {
      console.log('📸 創建源臉部圖片...');
      
      // 創建一個更複雜的"臉部"圖片
      const faceSvg = `
        <svg width="256" height="256">
          <defs>
            <radialGradient id="skin" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:#FFE4C4;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DEB887;stop-opacity:1" />
            </radialGradient>
            <radialGradient id="eye" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
            </radialGradient>
          </defs>
          <!-- 臉部輪廓 -->
          <ellipse cx="128" cy="128" rx="80" ry="100" fill="url(#skin)" stroke="#CD853F" stroke-width="2"/>
          <!-- 左眼 -->
          <ellipse cx="100" cy="110" rx="12" ry="8" fill="url(#eye)"/>
          <ellipse cx="100" cy="110" rx="4" ry="4" fill="white"/>
          <!-- 右眼 -->
          <ellipse cx="156" cy="110" rx="12" ry="8" fill="url(#eye)"/>
          <ellipse cx="156" cy="110" rx="4" ry="4" fill="white"/>
          <!-- 鼻子 -->
          <ellipse cx="128" cy="130" rx="6" ry="8" fill="#DEB887"/>
          <!-- 嘴巴 -->
          <ellipse cx="128" cy="160" rx="20" ry="8" fill="#8B0000"/>
        </svg>
      `;
      
      await sharp(Buffer.from(faceSvg))
        .jpeg({ quality: 95 })
        .toFile(sourceImagePath);
    }
    
    // 創建目標圖片（模擬職業照背景）
    const targetImagePath = path.join(__dirname, 'uploads', 'target_profession.jpg');
    if (!fs.existsSync(targetImagePath)) {
      console.log('📸 創建目標職業照...');
      
      // 創建一個職業照背景
      const professionSvg = `
        <svg width="512" height="512">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4169E1;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1E90FF;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="face" cx="50%" cy="40%" r="50%">
              <stop offset="0%" style="stop-color:#F5DEB3;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#D2B48C;stop-opacity:1" />
            </radialGradient>
          </defs>
          <!-- 背景 -->
          <rect width="512" height="512" fill="url(#bg)"/>
          <!-- 目標臉部（較大，用於臉部交換） -->
          <ellipse cx="256" cy="200" rx="120" ry="150" fill="url(#face)" stroke="#CD853F" stroke-width="3"/>
          <!-- 職業照元素 -->
          <rect x="50" y="400" width="412" height="80" fill="white" opacity="0.9"/>
          <text x="256" y="430" text-anchor="middle" font-family="Arial" font-size="24" fill="#333">PROFESSIONAL PHOTO</text>
          <text x="256" y="460" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">AI Generated</text>
        </svg>
      `;
      
      await sharp(Buffer.from(professionSvg))
        .jpeg({ quality: 95 })
        .toFile(targetImagePath);
    }
    
    // 讀取圖片
    const sourceImage = fs.readFileSync(sourceImagePath);
    const targetImage = fs.readFileSync(targetImagePath);
    
    // 建立 FormData
    const formData = new FormData();
    formData.append('source_photo', sourceImage, {
      filename: 'source_face.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('target_photo', targetImage, {
      filename: 'target_profession.jpg',
      contentType: 'image/jpeg'
    });
    
    // 發送請求到 Hugging Face Space
    const hfUrl = 'https://keithskk321-ice-solution-faceswap.hf.space';
    console.log('🔄 發送臉部交換請求...');
    
    const response = await axios.post(`${hfUrl}/swap`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 60000 // 1分鐘超時
    });
    
    console.log('✅ 臉部交換 API 成功！');
    console.log('📊 回應狀態:', response.status);
    console.log('📊 回應數據:', {
      success: response.data.success,
      message: response.data.message,
      hasResult: !!response.data.result
    });
    
    if (response.data.success && response.data.result) {
      // 從 base64 解碼圖片
      const base64Data = response.data.result.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      // 儲存結果
      const outputPath = path.join(__dirname, 'uploads', `faceswap_result_${Date.now()}.jpg`);
      fs.writeFileSync(outputPath, imageBuffer);
      
      console.log('🖼️ 臉部交換結果已儲存:', outputPath);
      console.log('');
      console.log('📋 測試圖片說明：');
      console.log('- 源圖片：模擬人臉（包含眼睛、鼻子、嘴巴）');
      console.log('- 目標圖片：職業照背景（藍色背景 + 白色文字區域）');
      console.log('- 預期效果：源臉部應該替換目標圖片中的臉部區域');
      console.log('');
      console.log('🔍 請檢查生成的結果圖片，確認臉部交換效果！');
    }
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.response?.data || error.message);
  }
}

testRealFaceSwap();
