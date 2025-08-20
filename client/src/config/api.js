// API 配置
const API_CONFIG = {
  // 開發環境
  development: {
    baseURL: 'http://localhost:5001',
    timeout: 30000
  },
  // 生產環境
  production: {
    baseURL: 'https://photobooth-api.ice-solution.hk',
    timeout: 30000
  }
};

// 根據環境選擇配置
const env = process.env.NODE_ENV || 'development';
const config = API_CONFIG[env];

// API 端點
export const API_ENDPOINTS = {
  // 語音轉文字
  VOICE_TRANSCRIBE: `${config.baseURL}/api/voice/transcribe`,
  
  // 職業驗證
  PROFESSION_VALIDATE: `${config.baseURL}/api/profession/validate`,
  
  // 生成職業照
  GENERATE_PHOTO: `${config.baseURL}/api/generate/profession-photo`,
  
  // 臉部交換
  FACE_SWAP: `${config.baseURL}/api/faceswap/swap`,
  
  // 上傳圖片
  UPLOAD_PHOTO: `${config.baseURL}/api/upload/photo`
};

// 導出配置
export const API_CONFIG_FINAL = config;

// 獲取完整 API URL
export const getApiUrl = (endpoint) => {
  return `${config.baseURL}${endpoint}`;
};
