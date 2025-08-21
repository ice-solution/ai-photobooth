import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const ProfessionValidation = ({ voiceText, sessionId, onValidated, onBack }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [editedText, setEditedText] = useState(voiceText);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (voiceText) {
      validateProfession(voiceText);
    }
  }, [voiceText, sessionId]);

  const validateProfession = async (text) => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch(API_ENDPOINTS.PROFESSION_VALIDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sessionId
        })
      });

      const data = await response.json();
      setValidationResult(data);

      if (data.valid) {
        toast.success('職業驗證成功！');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('職業驗證錯誤:', error);
      toast.error('職業驗證失敗');
      setValidationResult({
        valid: false,
        message: '驗證過程發生錯誤'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleEditSubmit = () => {
    setIsEditing(false);
    validateProfession(editedText);
  };

  const handleContinue = () => {
    if (validationResult && validationResult.valid) {
      onValidated(validationResult.profession);
    }
  };

  const handleRetry = () => {
    setValidationResult(null);
    setIsEditing(false);
    setEditedText(voiceText);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full"
      >
        {/* 標題 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            語音轉文字結果
          </h1>
          <p className="text-gray-600">
            請確認以下內容是否正確
          </p>
        </div>

        {/* 語音文字顯示 */}
        <div className="mb-6">
          <div className="mb-2">
            <label className="text-sm font-medium text-gray-700">語音內容：</label>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-800">{editedText}</p>
          </div>
        </div>

        {/* 驗證結果 */}
        {isValidating ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在驗證職業...</p>
          </div>
        ) : validationResult ? (
          <div className="mb-6">
            {validationResult.valid ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-800">職業驗證成功！</h3>
                    <p className="text-green-700">檢測到的職業：{validationResult.profession}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <X className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-red-800">職業驗證失敗</h3>
                    <p className="text-red-700">{validationResult.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* 操作按鈕 */}
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex-1 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回錄音
          </motion.button>
          
          {validationResult && !validationResult.valid && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRetry}
              className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center"
            >
              <X className="w-5 h-5 mr-2" />
              重新輸入
            </motion.button>
          )}
          
          {validationResult && validationResult.valid && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center"
            >
              <Check className="w-5 h-5 mr-2" />
              繼續下一步
            </motion.button>
          )}
        </div>

        {/* 提示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💡 支援的職業</h3>
          <p className="text-sm text-blue-700">
            我們支援各種職業，包括：醫生、護士、教師、律師、工程師、設計師、警察、消防員、廚師、攝影師、藝術家、音樂家、演員、運動員、科學家、記者等。
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionValidation;
