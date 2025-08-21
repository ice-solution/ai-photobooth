const fs = require('fs');
const path = require('path');
const PiAPIFaceSwap = require('./piapi-faceswap-integration');
const GenderDetection = require('./gender-detection');

async function testPiAPIFaceSwap() {
  console.log('🧪 測試 PiAPI 臉部交換...');
  
  try {
    const piapiFaceSwap = new PiAPIFaceSwap();
    const genderDetection = new GenderDetection();
    
    // 創建測試圖片
    const sharp = require('sharp');
    
    // 創建源臉部圖片（模擬用戶照片）
    const sourceImagePath = path.join(__dirname, 'uploads', 'test_source_face.jpg');
    if (!fs.existsSync(sourceImagePath)) {
      console.log('📸 創建源臉部圖片...');
      
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
    
    // 創建目標圖片（模擬職業照）
    const targetImagePath = path.join(__dirname, 'uploads', 'test_target_profession.jpg');
    if (!fs.existsSync(targetImagePath)) {
      console.log('📸 創建目標職業照...');
      
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
          <!-- 目標臉部 -->
          <ellipse cx="256" cy="200" rx="120" ry="150" fill="url(#face)" stroke="#CD853F" stroke-width="3"/>
          <!-- 職業照元素 -->
          <rect x="50" y="400" width="412" height="80" fill="white" opacity="0.9"/>
          <text x="256" y="430" text-anchor="middle" font-family="Arial" font-size="24" fill="#333">PROFESSIONAL PHOTO</text>
          <text x="256" y="460" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">PiAPI Test</text>
        </svg>
      `;
      
      await sharp(Buffer.from(professionSvg))
        .jpeg({ quality: 95 })
        .toFile(targetImagePath);
    }
    
    // 測試性別檢測
    console.log('🔍 測試性別檢測...');
    const genderResult = await genderDetection.detectGender(sourceImagePath, 'engineer');
    console.log('性別檢測結果:', genderResult);
    
    // 測試 PiAPI 臉部交換
    console.log('🔄 測試 PiAPI 臉部交換...');
    const resultPath = await piapiFaceSwap.performFaceSwapWithRetry(sourceImagePath, targetImagePath);
    
    console.log('✅ PiAPI 臉部交換成功！');
    console.log('📁 結果路徑:', resultPath);
    
    // 檢查結果文件是否存在
    if (fs.existsSync(resultPath)) {
      const stats = fs.statSync(resultPath);
      console.log('📊 結果文件大小:', (stats.size / 1024).toFixed(2), 'KB');
    }
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    
    if (error.response?.data) {
      console.error('API 錯誤詳情:', error.response.data);
    }
  }
}

testPiAPIFaceSwap();
