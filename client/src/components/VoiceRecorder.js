import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, RotateCcw, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const VoiceRecorder = ({ sessionId, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // 初始化 Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-TW';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscribedText(transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = (event) => {
        console.error('語音識別錯誤:', event.error);
        toast.error('語音識別失敗，請重試');
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognition);
    } else {
      toast.error('您的瀏覽器不支援語音識別功能');
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      setTranscribedText('');
      setIsRecording(true);
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleSubmit = async () => {
    if (!transcribedText) {
      toast.error('請先錄製語音');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 直接使用前端識別的文字，不需要上傳音訊檔案
      const response = await fetch(API_ENDPOINTS.VOICE_TRANSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcribedText: transcribedText,
          sessionId: sessionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('語音轉文字成功！');
        onComplete(data.text);
      } else {
        throw new Error(data.error || '語音轉文字失敗');
      }
    } catch (error) {
      console.error('語音轉文字錯誤:', error);
      toast.error(error.message || '語音轉文字失敗');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setTranscribedText('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        {/* 標題 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Mic className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            說出你的夢想職業
          </h1>
          <p className="text-gray-600">
            請對著麥克風說出你想要的職業，例如：「我想當醫生」
          </p>
        </div>

                {/* 錄音區域 */}
        <div className="space-y-6">
          {!transcribedText ? (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-colors flex items-center justify-center mx-auto ${
                  isRecording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Mic className={`w-6 h-6 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                {isRecording ? '停止錄音' : '開始錄音'}
              </motion.button>
              
              {isRecording && (
                <div className="mt-4">
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">正在聆聽...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-100 rounded-lg p-4">
                <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">語音識別完成！</p>
                <p className="text-green-700 text-sm mt-1">"{transcribedText}"</p>
              </div>
              
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  重新錄製
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      處理中...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      確認送出
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* 提示 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💡 小提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 請在安靜的環境中錄音</li>
            <li>• 說話要清楚且音量適中</li>
            <li>• 可以說：「我想當醫生」、「我的夢想是成為老師」等</li>
            <li>• 支援的職業包括：醫生、護士、教師、工程師等</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceRecorder;
