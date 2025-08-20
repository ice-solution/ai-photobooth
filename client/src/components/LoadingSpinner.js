import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ message, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
      >
        {/* 載入動畫 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Loader2 className="w-10 h-10 text-white" />
        </motion.div>

        {/* 標題 */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          {message}
        </motion.h2>

        {/* 副標題 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          {subtitle}
        </motion.p>

        {/* 動畫點點 */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 bg-primary-500 rounded-full"
            />
          ))}
        </div>

        {/* 裝飾元素 */}
        <div className="mt-8 flex justify-center space-x-4">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 0
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 0.5
            }}
          >
            <Sparkles className="w-6 h-6 text-pink-400" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 1
            }}
          >
            <Sparkles className="w-6 h-6 text-blue-400" />
          </motion.div>
        </div>

        {/* 進度條 */}
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* 提示文字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-500 mt-4"
        >
          請稍候，這可能需要幾分鐘時間...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
