import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft, RotateCcw, Upload } from 'lucide-react';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';

const PhotoCapture = ({ sessionId, profession, onCaptured, onBack }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const uploadPhoto = async () => {
    if (!capturedImage) {
      toast.error('請先拍照');
      return;
    }

    setIsUploading(true);

    try {
      // 將 base64 圖片轉換為 blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');
      formData.append('sessionId', sessionId);

      const uploadResponse = await fetch('/api/faceswap/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await uploadResponse.json();

      if (data.success) {
        toast.success('照片上傳成功！');
        onCaptured(data.photoUrl);
      } else {
        throw new Error(data.error || '照片上傳失敗');
      }
    } catch (error) {
      console.error('照片上傳錯誤:', error);
      toast.error(error.message || '照片上傳失敗');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
      >
        {/* 標題 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Camera className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            拍攝正面照片
          </h1>
          <p className="text-gray-600">
            請拍攝一張清晰的正面照片，用於生成你的 {profession} 職業照
          </p>
        </div>

        {/* 拍照區域 */}
        <div className="space-y-6">
          {!capturedImage ? (
            <div className="text-center">
              <div className="relative inline-block">
                <div className="border-4 border-gray-200 rounded-lg overflow-hidden">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full max-w-md"
                  />
                </div>
                <div className="absolute inset-0 border-4 border-transparent rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={capture}
                className="mt-6 bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center mx-auto"
              >
                <Camera className="w-6 h-6 mr-2" />
                拍照
              </motion.button>
            </div>
          ) : (
            <div className="text-center">
              <div className="border-4 border-gray-200 rounded-lg overflow-hidden inline-block">
                <img
                  src={capturedImage}
                  alt="拍攝的照片"
                  className="w-full max-w-md"
                />
              </div>
              
              <div className="flex space-x-4 mt-6 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={retake}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  重新拍照
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={uploadPhoto}
                  disabled={isUploading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      上傳中...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      確認使用
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* 拍照提示 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">📸 拍照小貼士</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 請在光線充足的地方拍照</li>
            <li>• 保持正面面對鏡頭</li>
            <li>• 表情自然，眼睛睜開</li>
            <li>• 避免戴帽子或墨鏡</li>
            <li>• 確保臉部清晰可見</li>
          </ul>
        </div>

        {/* 返回按鈕 */}
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="w-full px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回上一步
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoCapture;
