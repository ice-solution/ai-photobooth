import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const GenderSelection = ({ userPhoto, profession, onGenderSelected, onBack }) => {
  const [selectedGender, setSelectedGender] = useState('');

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleConfirm = () => {
    if (!selectedGender) {
      toast.error('請選擇性別');
      return;
    }
    
    onGenderSelected(selectedGender);
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
            className="w-20 h-20 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            選擇性別
          </h1>
          <p className="text-gray-600">
            請選擇你的性別，這將幫助 AI 生成更準確的 {profession} 職業照
          </p>
        </div>

        {/* 照片預覽 */}
        {userPhoto && (
          <div className="text-center mb-8">
            <div className="inline-block border-4 border-gray-200 rounded-lg overflow-hidden">
              <img
                src={userPhoto}
                alt="你的照片"
                className="w-48 h-48 object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">你的照片</p>
          </div>
        )}

        {/* 性別選擇 */}
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 男性選項 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenderSelect('male')}
              className={`p-6 rounded-2xl border-4 transition-all duration-200 ${
                selectedGender === 'male'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  selectedGender === 'male' ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <User className={`w-8 h-8 ${selectedGender === 'male' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">男性</h3>
                <p className="text-sm text-gray-600">生成男性 {profession} 職業照</p>
                {selectedGender === 'male' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 text-blue-600 font-medium"
                  >
                    ✓ 已選擇
                  </motion.div>
                )}
              </div>
            </motion.button>

            {/* 女性選項 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenderSelect('female')}
              className={`p-6 rounded-2xl border-4 transition-all duration-200 ${
                selectedGender === 'female'
                  ? 'border-pink-500 bg-pink-50 shadow-lg'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  selectedGender === 'female' ? 'bg-pink-500' : 'bg-gray-300'
                }`}>
                  <User className={`w-8 h-8 ${selectedGender === 'female' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">女性</h3>
                <p className="text-sm text-gray-600">生成女性 {profession} 職業照</p>
                {selectedGender === 'female' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 text-pink-600 font-medium"
                  >
                    ✓ 已選擇
                  </motion.div>
                )}
              </div>
            </motion.button>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex-1 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回上一步
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            disabled={!selectedGender}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            確認並生成
          </motion.button>
        </div>

        {/* 提示 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💡 重要提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 選擇正確的性別可以避免生成錯誤的職業照</li>
            <li>• 女性玩家選擇「女性」會生成女性職業照</li>
            <li>• 男性玩家選擇「男性」會生成男性職業照</li>
            <li>• 這將確保 AI 生成的照片符合你的性別特徵</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default GenderSelection;
