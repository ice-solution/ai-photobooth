import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import VoiceRecorder from './components/VoiceRecorder';
import PhotoCapture from './components/PhotoCapture';
import ProfessionValidation from './components/ProfessionValidation';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generateSessionId } from './utils/session';
import { API_ENDPOINTS } from './config/api';

function App() {
  const [currentStep, setCurrentStep] = useState('voice');
  const [sessionId, setSessionId] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [profession, setProfession] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [generatedPhoto, setGeneratedPhoto] = useState('');
  const [finalPhoto, setFinalPhoto] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    // 生成會話 ID
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  }, []);

  const handleVoiceComplete = (text) => {
    setVoiceText(text);
    setCurrentStep('validation');
  };

  const handleProfessionValidated = (validProfession) => {
    setProfession(validProfession);
    setCurrentStep('photo');
  };

  const handlePhotoCaptured = (photoUrl) => {
    setUserPhoto(photoUrl);
    setCurrentStep('generating');
    generateProfessionPhoto(profession);
  };

  const handleGenerationComplete = (photoUrl) => {
    setGeneratedPhoto(photoUrl);
    setCurrentStep('faceswapping');
    performFaceSwap();
  };

  const handleFaceSwapComplete = (photoUrl) => {
    setFinalPhoto(photoUrl);
    setCurrentStep('result');
  };

  const generateProfessionPhoto = async (profession) => {
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_PHOTO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profession,
          sessionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        handleGenerationComplete(data.imageUrl);
      } else {
        throw new Error(data.error || '生成職業照失敗');
      }
    } catch (err) {
      setError(err.message);
      setCurrentStep('error');
    }
  };

  const performFaceSwap = async () => {
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.FACE_SWAP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      
      if (data.success) {
        handleFaceSwapComplete(data.finalPhotoUrl);
      } else {
        throw new Error(data.error || '換臉失敗');
      }
    } catch (err) {
      setError(err.message);
      setCurrentStep('error');
    }
  };

  const resetApp = () => {
    setCurrentStep('voice');
    setVoiceText('');
    setProfession('');
    setUserPhoto('');
    setGeneratedPhoto('');
    setFinalPhoto('');
    setError('');
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'voice':
        return (
          <VoiceRecorder
            sessionId={sessionId}
            onComplete={handleVoiceComplete}
          />
        );
      case 'validation':
        return (
          <ProfessionValidation
            voiceText={voiceText}
            sessionId={sessionId}
            onValidated={handleProfessionValidated}
            onBack={() => setCurrentStep('voice')}
          />
        );
      case 'photo':
        return (
          <PhotoCapture
            sessionId={sessionId}
            profession={profession}
            onCaptured={handlePhotoCaptured}
            onBack={() => setCurrentStep('validation')}
          />
        );
      case 'generating':
        return (
          <LoadingSpinner
            message="正在生成你的職業照..."
            subtitle="AI 正在為你創造專業的職業形象"
          />
        );
      case 'faceswapping':
        return (
          <LoadingSpinner
            message="正在進行臉部交換..."
            subtitle="將你的臉部特徵融入職業照中"
          />
        );
      case 'result':
        return (
          <ResultDisplay
            userPhoto={userPhoto}
            generatedPhoto={generatedPhoto}
            finalPhoto={finalPhoto}
            profession={profession}
            onReset={resetApp}
          />
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">發生錯誤</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={resetApp}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                重新開始
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
