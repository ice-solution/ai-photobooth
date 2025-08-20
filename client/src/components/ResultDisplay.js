import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, RotateCcw, Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ResultDisplay = ({ userPhoto, generatedPhoto, finalPhoto, profession, onReset }) => {
  const [selectedImage, setSelectedImage] = useState('final');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const imageUrl = selectedImage === 'final' ? finalPhoto : 
                      selectedImage === 'generated' ? generatedPhoto : userPhoto;
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `我的${profession}職業照.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('圖片下載成功！');
    } catch (error) {
      console.error('下載錯誤:', error);
      toast.error('下載失敗');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `我的${profession}職業照`,
          text: `看看我的AI生成的${profession}職業照！`,
          url: window.location.href
        });
      } else {
        // 複製連結到剪貼簿
        await navigator.clipboard.writeText(window.location.href);
        toast.success('連結已複製到剪貼簿！');
      }
    } catch (error) {
      console.error('分享錯誤:', error);
      toast.error('分享失敗');
    }
  };

  const images = [
    { id: 'final', label: '最終結果', src: finalPhoto },
    { id: 'generated', label: 'AI生成', src: generatedPhoto },
    { id: 'original', label: '原始照片', src: userPhoto }
  ];

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

        {/* 圖片選擇器 */}
        <div className="flex justify-center space-x-4 mb-6">
          {images.map((image) => (
            <motion.button
              key={image.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(image.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedImage === image.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {image.label}
            </motion.button>
          ))}
        </div>

        {/* 主要圖片顯示 */}
        <div className="text-center mb-8">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-block border-4 border-gray-200 rounded-lg overflow-hidden"
          >
            <img
              src={images.find(img => img.id === selectedImage)?.src}
              alt={`${profession}職業照`}
              className="max-w-full max-h-96 object-contain"
            />
          </motion.div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                下載中...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                下載圖片
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            分享結果
          </motion.button>

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

        {/* 圖片比較 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {images.map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ scale: 1.02 }}
              className="text-center"
            >
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-2">
                <img
                  src={image.src}
                  alt={image.label}
                  className="w-full h-32 object-cover"
                />
              </div>
              <p className="text-sm font-medium text-gray-700">{image.label}</p>
            </motion.div>
          ))}
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
            <li>• 點擊不同標籤可以查看不同階段的圖片</li>
            <li>• 下載的圖片為高品質 JPG 格式</li>
            <li>• 可以分享連結給朋友體驗</li>
            <li>• 隨時可以重新開始生成新的職業照</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultDisplay;
