const fs = require('fs');
const path = require('path');
const PiAPIFaceSwap = require('./piapi-faceswap-integration');
const GenderDetection = require('./gender-detection');

async function testPiAPIWithRealImages() {
  console.log('🧪 測試 PiAPI 臉部交換（真實圖片）...');
  
  try {
    const piapiFaceSwap = new PiAPIFaceSwap();
    const genderDetection = new GenderDetection();
    
    // 檢查是否有現有的測試圖片
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    
    // 尋找可能的源臉部圖片和目標圖片
    let sourceImagePath = null;
    let targetImagePath = null;
    
    // 尋找用戶上傳的照片
    const userPhotos = files.filter(file => 
      file.includes('user_') || 
      file.includes('photo_') || 
      file.includes('capture_') ||
      file.includes('.jpg') || 
      file.includes('.png')
    );
    
    // 尋找生成的職業照
    const generatedPhotos = files.filter(file => 
      file.includes('generated_') || 
      file.includes('profession_') ||
      file.includes('stability_')
    );
    
    if (userPhotos.length > 0) {
      sourceImagePath = path.join(uploadsDir, userPhotos[0]);
      console.log('📸 使用現有用戶照片:', userPhotos[0]);
    }
    
    if (generatedPhotos.length > 0) {
      targetImagePath = path.join(uploadsDir, generatedPhotos[0]);
      console.log('📸 使用現有職業照:', generatedPhotos[0]);
    }
    
    // 如果沒有找到合適的圖片，創建測試圖片
    if (!sourceImagePath) {
      console.log('📸 創建測試源臉部圖片...');
      sourceImagePath = path.join(uploadsDir, 'test_real_source.jpg');
      
      // 創建一個更真實的臉部圖片
      const sharp = require('sharp');
      
      // 創建一個簡單的彩色臉部圖片
      const faceBuffer = await sharp({
        create: {
          width: 512,
          height: 512,
          channels: 3,
          background: { r: 255, g: 228, b: 196 } // 膚色
        }
      })
      .composite([
        {
          input: Buffer.from(`
            <svg width="512" height="512">
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
              <ellipse cx="256" cy="256" rx="160" ry="200" fill="url(#skin)" stroke="#CD853F" stroke-width="4"/>
              <!-- 左眼 -->
              <ellipse cx="200" cy="220" rx="24" ry="16" fill="url(#eye)"/>
              <ellipse cx="200" cy="220" rx="8" ry="8" fill="white"/>
              <!-- 右眼 -->
              <ellipse cx="312" cy="220" rx="24" ry="16" fill="url(#eye)"/>
              <ellipse cx="312" cy="220" rx="8" ry="8" fill="white"/>
              <!-- 鼻子 -->
              <ellipse cx="256" cy="260" rx="12" ry="16" fill="#DEB887"/>
              <!-- 嘴巴 -->
              <ellipse cx="256" cy="320" rx="40" ry="16" fill="#8B0000"/>
              <!-- 眉毛 -->
              <ellipse cx="200" cy="200" rx="30" ry="8" fill="#654321"/>
              <ellipse cx="312" cy="200" rx="30" ry="8" fill="#654321"/>
            </svg>
          `),
          top: 0,
          left: 0
        }
      ])
      .jpeg({ quality: 95 })
      .toBuffer();
      
      fs.writeFileSync(sourceImagePath, faceBuffer);
    }
    
    if (!targetImagePath) {
      console.log('📸 創建測試目標職業照...');
      targetImagePath = path.join(uploadsDir, 'test_real_target.jpg');
      
      const sharp = require('sharp');
      
      // 創建一個更真實的職業照
      const professionBuffer = await sharp({
        create: {
          width: 1024,
          height: 1024,
          channels: 3,
          background: { r: 65, g: 105, b: 225 } // 藍色背景
        }
      })
      .composite([
        {
          input: Buffer.from(`
            <svg width="1024" height="1024">
              <defs>
                <radialGradient id="face" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" style="stop-color:#F5DEB3;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#D2B48C;stop-opacity:1" />
                </radialGradient>
              </defs>
              <!-- 目標臉部 -->
              <ellipse cx="512" cy="400" rx="240" ry="300" fill="url(#face)" stroke="#CD853F" stroke-width="6"/>
              <!-- 職業照元素 -->
              <rect x="100" y="800" width="824" height="160" fill="white" opacity="0.9"/>
              <text x="512" y="860" text-anchor="middle" font-family="Arial" font-size="48" fill="#333">PROFESSIONAL PHOTO</text>
              <text x="512" y="920" text-anchor="middle" font-family="Arial" font-size="32" fill="#666">PiAPI Real Test</text>
            </svg>
          `),
          top: 0,
          left: 0
        }
      ])
      .jpeg({ quality: 95 })
      .toBuffer();
      
      fs.writeFileSync(targetImagePath, professionBuffer);
    }
    
    // 測試性別檢測
    console.log('🔍 測試性別檢測...');
    const genderResult = await genderDetection.detectGender(sourceImagePath, 'engineer');
    console.log('性別檢測結果:', genderResult);
    
    // 測試 PiAPI 臉部交換
    console.log('🔄 測試 PiAPI 臉部交換...');
    console.log('源圖片:', sourceImagePath);
    console.log('目標圖片:', targetImagePath);
    
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

testPiAPIWithRealImages();
