#!/usr/bin/env python3
"""
FaceDancer 簡化自建服務
"""

import os
import sys
import logging
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
import base64

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class SimpleFaceDancerService:
    def __init__(self):
        self.initialized = True
        
    def preprocess_image(self, image_path, target_size=(256, 256)):
        """預處理圖片"""
        try:
            # 讀取圖片
            img = Image.open(image_path)
            
            # 轉換為 RGB
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # 調整大小
            img = img.resize(target_size, Image.LANCZOS)
            
            return img
            
        except Exception as e:
            logger.error(f"❌ 圖片預處理失敗: {e}")
            raise
    
    def create_face_mask(self, size):
        """創建臉部遮罩"""
        try:
            # 創建橢圓形遮罩
            mask = Image.new('L', (size, size), 0)
            draw = ImageDraw.Draw(mask)
            
            # 繪製橢圓形
            ellipse_bbox = [0, 0, size, size]
            draw.ellipse(ellipse_bbox, fill=255)
            
            # 應用高斯模糊
            mask = mask.filter(ImageFilter.GaussianBlur(radius=5))
            
            return mask
            
        except Exception as e:
            logger.error(f"❌ 遮罩創建失敗: {e}")
            raise
    
    def perform_face_swap(self, source_path, target_path):
        """執行臉部交換"""
        try:
            logger.info("🔄 開始臉部交換...")
            
            # 預處理圖片
            source_img = self.preprocess_image(source_path)
            target_img = self.preprocess_image(target_path)
            
            # 獲取圖片尺寸
            target_width, target_height = target_img.size
            
            # 計算臉部區域
            face_size = min(target_width, target_height) * 0.4
            face_x = (target_width - face_size) // 2
            face_y = int(target_height * 0.15)
            
            # 調整源臉部大小
            source_face = source_img.resize((int(face_size), int(face_size)), Image.LANCZOS)
            
            # 創建遮罩
            mask = self.create_face_mask(int(face_size))
            
            # 合成臉部
            target_img.paste(source_face, (face_x, face_y), mask)
            
            # 顏色調整
            target_array = np.array(target_img)
            target_array = target_array.astype(np.float32)
            target_array = np.clip(target_array * 1.05, 0, 255).astype(np.uint8)
            
            result = Image.fromarray(target_array)
            
            logger.info("✅ 臉部交換完成")
            return result
            
        except Exception as e:
            logger.error(f"❌ 臉部交換失敗: {e}")
            raise

# 初始化服務
service = SimpleFaceDancerService()

@app.route('/health', methods=['GET'])
def health_check():
    """健康檢查"""
    return jsonify({
        "status": "OK",
        "message": "FaceDancer 簡化服務正常運行",
        "version": "1.0.0"
    })

@app.route('/swap', methods=['POST'])
def face_swap():
    """臉部交換 API"""
    try:
        # 檢查檔案
        if 'source_face' not in request.files or 'target_image' not in request.files:
            return jsonify({"error": "缺少必要檔案"}), 400
        
        source_file = request.files['source_face']
        target_file = request.files['target_image']
        
        # 檢查檔案類型
        if not source_file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            return jsonify({"error": "源臉部檔案必須是圖片"}), 400
        
        if not target_file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            return jsonify({"error": "目標圖片檔案必須是圖片"}), 400
        
        # 儲存臨時檔案
        source_path = "/tmp/source_face.jpg"
        target_path = "/tmp/target_image.jpg"
        
        source_file.save(source_path)
        target_file.save(target_path)
        
        # 執行臉部交換
        result = service.perform_face_swap(source_path, target_path)
        
        # 轉換為 bytes
        result_buffer = io.BytesIO()
        result.save(result_buffer, format='JPEG', quality=95)
        result_buffer.seek(0)
        
        # 清理臨時檔案
        try:
            os.remove(source_path)
            os.remove(target_path)
        except:
            pass
        
        # 返回圖片
        return send_file(
            result_buffer,
            mimetype='image/jpeg',
            as_attachment=True,
            download_name='facedancer_result.jpg'
        )
        
    except Exception as e:
        logger.error(f"❌ API 錯誤: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/swap_base64', methods=['POST'])
def face_swap_base64():
    """臉部交換 API (Base64)"""
    try:
        data = request.get_json()
        
        if not data or 'source_face' not in data or 'target_image' not in data:
            return jsonify({"error": "缺少必要參數"}), 400
        
        # 解碼 Base64
        source_data = base64.b64decode(data['source_face'].split(',')[1] if ',' in data['source_face'] else data['source_face'])
        target_data = base64.b64decode(data['target_image'].split(',')[1] if ',' in data['target_image'] else data['target_image'])
        
        # 儲存臨時檔案
        source_path = "/tmp/source_face_base64.jpg"
        target_path = "/tmp/target_image_base64.jpg"
        
        with open(source_path, 'wb') as f:
            f.write(source_data)
        
        with open(target_path, 'wb') as f:
            f.write(target_data)
        
        # 執行臉部交換
        result = service.perform_face_swap(source_path, target_path)
        
        # 轉換為 Base64
        result_buffer = io.BytesIO()
        result.save(result_buffer, format='JPEG', quality=95)
        result_buffer.seek(0)
        result_base64 = base64.b64encode(result_buffer.getvalue()).decode()
        
        # 清理臨時檔案
        try:
            os.remove(source_path)
            os.remove(target_path)
        except:
            pass
        
        return jsonify({
            "success": True,
            "result": f"data:image/jpeg;base64,{result_base64}",
            "message": "臉部交換完成"
        })
        
    except Exception as e:
        logger.error(f"❌ Base64 API 錯誤: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "臉部交換失敗"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    logger.info(f"🚀 FaceDancer 簡化服務啟動在端口 {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
