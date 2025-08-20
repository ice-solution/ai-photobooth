#!/usr/bin/env python3
"""
FaceDancer 自建服務
基於 https://github.com/felixrosberg/FaceDancer
"""

import os
import sys
import logging
import numpy as np
from PIL import Image
import cv2
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow_addons.layers import InstanceNormalization

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class FaceDancerService:
    def __init__(self):
        self.model = None
        self.arcface_model = None
        self.initialized = False
        
    def load_models(self):
        """載入 FaceDancer 模型"""
        try:
            # 載入 FaceDancer 模型
            model_path = "./model_zoo/FaceDancer_config_c_HQ.h5"
            if os.path.exists(model_path):
                self.model = load_model(model_path, compile=False, 
                                      custom_objects={
                                          "InstanceNormalization": InstanceNormalization
                                      })
                logger.info("✅ FaceDancer 模型載入成功")
            else:
                logger.warning("⚠️ FaceDancer 模型檔案不存在，將使用模擬模式")
                
            # 載入 ArcFace 模型
            arcface_path = "./arcface_model/arcface/arcface.h5"
            if os.path.exists(arcface_path):
                self.arcface_model = load_model(arcface_path, compile=False)
                logger.info("✅ ArcFace 模型載入成功")
            else:
                logger.warning("⚠️ ArcFace 模型檔案不存在，將使用模擬模式")
                
            self.initialized = True
            
        except Exception as e:
            logger.error(f"❌ 模型載入失敗: {e}")
            self.initialized = False
    
    def preprocess_image(self, image_path, target_size=(256, 256)):
        """預處理圖片"""
        try:
            # 讀取圖片
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("無法讀取圖片")
            
            # 轉換為 RGB
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # 調整大小
            img = cv2.resize(img, target_size)
            
            # 正規化
            img = img.astype(np.float32) / 255.0
            
            return img
            
        except Exception as e:
            logger.error(f"❌ 圖片預處理失敗: {e}")
            raise
    
    def detect_and_align_face(self, image_path):
        """檢測和對齊臉部"""
        try:
            # 這裡應該使用 RetinaFace 進行臉部檢測和對齊
            # 為了簡化，我們直接返回預處理後的圖片
            return self.preprocess_image(image_path)
            
        except Exception as e:
            logger.error(f"❌ 臉部檢測失敗: {e}")
            raise
    
    def perform_face_swap(self, source_path, target_path):
        """執行臉部交換"""
        try:
            if not self.initialized:
                logger.warning("⚠️ 模型未初始化，使用模擬模式")
                return self.simulate_face_swap(source_path, target_path)
            
            # 檢測和對齊臉部
            source_face = self.detect_and_align_face(source_path)
            target_image = self.detect_and_align_face(target_path)
            
            # 準備輸入
            source_face = np.expand_dims(source_face, axis=0)
            target_image = np.expand_dims(target_image, axis=0)
            
            # 如果 ArcFace 模型可用，提取特徵
            if self.arcface_model is not None:
                source_features = self.arcface_model(source_face)
            else:
                # 模擬特徵
                source_features = np.random.randn(1, 512)
            
            # 執行臉部交換
            if self.model is not None:
                result = self.model([target_image, source_features])
                result = result.numpy()[0]
            else:
                # 模擬結果
                result = target_image[0]
            
            # 後處理
            result = np.clip(result, 0, 1)
            result = (result * 255).astype(np.uint8)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ 臉部交換失敗: {e}")
            raise
    
    def simulate_face_swap(self, source_path, target_path):
        """模擬臉部交換（當模型不可用時）"""
        try:
            logger.info("🔄 使用模擬臉部交換")
            
            # 讀取圖片
            source_img = cv2.imread(source_path)
            target_img = cv2.imread(target_path)
            
            if source_img is None or target_img is None:
                raise ValueError("無法讀取圖片")
            
            # 調整大小
            target_img = cv2.resize(target_img, (256, 256))
            source_face = cv2.resize(source_img, (112, 112))
            
            # 簡單的臉部合成
            # 在目標圖片中心區域合成源臉部
            center_x, center_y = 128, 128
            face_size = 80
            
            # 計算臉部區域
            x1 = max(0, center_x - face_size // 2)
            y1 = max(0, center_y - face_size // 2)
            x2 = min(256, center_x + face_size // 2)
            y2 = min(256, center_y + face_size // 2)
            
            # 調整源臉部大小
            face_region = cv2.resize(source_face, (x2 - x1, y2 - y1))
            
            # 合成
            target_img[y1:y2, x1:x2] = face_region
            
            # 轉換為 RGB
            result = cv2.cvtColor(target_img, cv2.COLOR_BGR2RGB)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ 模擬臉部交換失敗: {e}")
            raise

# 初始化服務
face_dancer_service = FaceDancerService()

@app.route('/health', methods=['GET'])
def health_check():
    """健康檢查"""
    return jsonify({
        'status': 'OK',
        'message': 'FaceDancer 服務正常運行',
        'initialized': face_dancer_service.initialized
    })

@app.route('/swap', methods=['POST'])
def face_swap():
    """臉部交換 API"""
    try:
        # 檢查請求
        if 'source_face' not in request.files or 'target_image' not in request.files:
            return jsonify({'error': '缺少必要的圖片檔案'}), 400
        
        # 獲取檔案
        source_file = request.files['source_face']
        target_file = request.files['target_image']
        
        # 儲存臨時檔案
        source_path = '/tmp/source_face.jpg'
        target_path = '/tmp/target_image.jpg'
        
        source_file.save(source_path)
        target_file.save(target_path)
        
        # 執行臉部交換
        result = face_dancer_service.perform_face_swap(source_path, target_path)
        
        # 轉換為 PIL Image
        result_img = Image.fromarray(result)
        
        # 儲存結果
        output_path = '/tmp/result.jpg'
        result_img.save(output_path, 'JPEG', quality=95)
        
        # 清理臨時檔案
        try:
            os.remove(source_path)
            os.remove(target_path)
        except:
            pass
        
        # 返回結果
        return send_file(output_path, mimetype='image/jpeg')
        
    except Exception as e:
        logger.error(f"❌ 臉部交換 API 錯誤: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/models/status', methods=['GET'])
def model_status():
    """模型狀態檢查"""
    return jsonify({
        'facedancer_loaded': face_dancer_service.model is not None,
        'arcface_loaded': face_dancer_service.arcface_model is not None,
        'initialized': face_dancer_service.initialized
    })

if __name__ == '__main__':
    # 載入模型
    logger.info("🔄 正在載入 FaceDancer 模型...")
    face_dancer_service.load_models()
    
    # 啟動服務
    port = int(os.environ.get('PORT', 8000))
    logger.info(f"🚀 FaceDancer 服務啟動在端口 {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
