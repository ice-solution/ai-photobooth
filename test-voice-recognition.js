// 測試語音識別功能
console.log('🧪 測試語音識別功能...');

// 檢查瀏覽器支援
function checkSpeechRecognitionSupport() {
  console.log('📋 檢查瀏覽器支援...');
  
  const userAgent = navigator.userAgent;
  console.log('🌐 User Agent:', userAgent);
  
  const isIPad = /ipad/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isChrome = /chrome/i.test(userAgent);
  const isSafari = /safari/i.test(userAgent);
  
  console.log('📱 設備檢測:');
  console.log('- iPad:', isIPad);
  console.log('- iOS:', isIOS);
  console.log('- Chrome:', isChrome);
  console.log('- Safari:', isSafari);
  
  // 檢查 Web Speech API 支援
  const hasSpeechRecognition = 'SpeechRecognition' in window;
  const hasWebkitSpeechRecognition = 'webkitSpeechRecognition' in window;
  
  console.log('🎤 Web Speech API 支援:');
  console.log('- SpeechRecognition:', hasSpeechRecognition);
  console.log('- webkitSpeechRecognition:', hasWebkitSpeechRecognition);
  
  if (hasSpeechRecognition || hasWebkitSpeechRecognition) {
    console.log('✅ 瀏覽器支援語音識別');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    console.log('🔧 語音識別設定:');
    console.log('- 語言:', recognition.lang);
    console.log('- 連續模式:', recognition.continuous);
    console.log('- 中間結果:', recognition.interimResults);
    console.log('- 最大替代方案:', recognition.maxAlternatives);
    
    return true;
  } else {
    console.log('❌ 瀏覽器不支援語音識別');
    return false;
  }
}

// 測試不同語言設定
function testLanguageSettings() {
  console.log('\n🌐 測試語言設定...');
  
  const languages = [
    { code: 'zh-CN', name: '簡體中文' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'zh-HK', name: '香港中文' },
    { code: 'en-US', name: '美式英文' },
    { code: 'en-GB', name: '英式英文' }
  ];
  
  languages.forEach(lang => {
    console.log(`- ${lang.code}: ${lang.name}`);
  });
  
  console.log('\n💡 建議:');
  console.log('- iPad Chrome: 使用 zh-CN (簡體中文)');
  console.log('- 桌面 Chrome: 使用 zh-TW (繁體中文)');
  console.log('- 如果識別不準確，嘗試切換語言');
}

// 檢查麥克風權限
async function checkMicrophonePermission() {
  console.log('\n🎤 檢查麥克風權限...');
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('✅ 麥克風權限已獲得');
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.log('❌ 麥克風權限問題:', error.message);
    
    switch (error.name) {
      case 'NotAllowedError':
        console.log('💡 解決方案: 請允許瀏覽器使用麥克風');
        break;
      case 'NotFoundError':
        console.log('💡 解決方案: 請檢查麥克風是否連接');
        break;
      case 'NotSupportedError':
        console.log('💡 解決方案: 瀏覽器不支援麥克風');
        break;
      default:
        console.log('💡 解決方案: 請檢查麥克風設定');
    }
    
    return false;
  }
}

// 執行測試
async function runTests() {
  console.log('🚀 開始語音識別測試...\n');
  
  // 1. 檢查瀏覽器支援
  const hasSupport = checkSpeechRecognitionSupport();
  
  // 2. 測試語言設定
  testLanguageSettings();
  
  // 3. 檢查麥克風權限
  const hasPermission = await checkMicrophonePermission();
  
  console.log('\n📊 測試結果:');
  console.log('- 瀏覽器支援:', hasSupport ? '✅' : '❌');
  console.log('- 麥克風權限:', hasPermission ? '✅' : '❌');
  
  if (hasSupport && hasPermission) {
    console.log('\n🎉 語音識別功能正常！');
    console.log('💡 建議:');
    console.log('1. 在安靜環境中使用');
    console.log('2. 說話清楚且音量適中');
    console.log('3. 如果識別不準確，嘗試切換語言設定');
  } else {
    console.log('\n⚠️ 語音識別功能有問題');
    console.log('💡 請檢查上述問題並解決');
  }
}

// 執行測試
runTests();
