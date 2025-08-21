import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ResultDisplay = ({ userPhoto, generatedPhoto, finalPhoto, profession, onReset }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // 生成 QR Code
    if (finalPhoto) {
      generateQRCode(finalPhoto);
    }
  }, [finalPhoto]);

  const generateQRCode = (url) => {
    // 使用 QR Server API 生成 QR Code
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrApiUrl);
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full"
      >
        {/* 標題 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Star className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            你的{profession}職業照完成！
          </h1>
          <p className="text-gray-600">
            恭喜你！AI 已經成功為你生成了專業的職業照
          </p>
        </div>

        {/* 主要圖片顯示 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-block border-4 border-gray-200 rounded-lg overflow-hidden"
          >
            <img
              src={finalPhoto}
              alt={`${profession}職業照`}
              className="max-w-full max-h-96 object-contain"
            />
          </motion.div>
        </div>

        {/* QR Code 顯示 */}
        {qrCodeUrl && (
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">掃描 QR Code 下載圖片</h3>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="inline-block bg-white p-4 rounded-lg shadow-lg"
            >
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48"
              />
            </motion.div>
            <p className="text-sm text-gray-600 mt-2">使用手機掃描 QR Code 即可下載圖片</p>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            重新開始
          </motion.button>
        </div>

        {/* 成功訊息 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="font-semibold text-green-800">生成成功！</h3>
          </div>
          <p className="text-green-700">
            你的 {profession} 職業照已經準備就緒！你可以下載保存或分享給朋友。
          </p>
        </div>

        {/* 提示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 掃描 QR Code 即可下載高品質職業照</li>
            <li>• 圖片為 JPG 格式，適合各種用途</li>
            <li>• 可以分享 QR Code 給朋友下載</li>
            <li>• 隨時可以重新開始生成新的職業照</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultDisplay;
