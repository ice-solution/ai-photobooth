from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile
from PIL import Image
import io
import base64
from app import FaceDancerInference

app = FastAPI(title="FaceDancer API", version="1.0.0")

# 添加 CORS 支援
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化推理引擎
inference_engine = FaceDancerInference()

@app.get("/")
async def root():
    """根端點"""
    return {"message": "FaceDancer API 服務正常運行", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """健康檢查"""
    return {"status": "OK", "message": "FaceDancer API 服務正常運行"}

@app.post("/swap")
async def face_swap(
    source_face: UploadFile = File(...),
    target_image: UploadFile = File(...)
):
    """臉部交換 API"""
    try:
        # 檢查檔案類型
        if not source_face.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="源臉部檔案必須是圖片")
        if not target_image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="目標圖片檔案必須是圖片")
        
        # 讀取圖片
        source_data = await source_face.read()
        target_data = await target_image.read()
        
        # 轉換為 PIL Image
        source_image = Image.open(io.BytesIO(source_data))
        target_image = Image.open(io.BytesIO(target_data))
        
        # 執行臉部交換
        result = inference_engine.perform_face_swap(source_image, target_image)
        
        # 轉換為 bytes
        result_buffer = io.BytesIO()
        result.save(result_buffer, format='JPEG', quality=95)
        result_buffer.seek(0)
        
        # 返回圖片
        return FileResponse(
            io.BytesIO(result_buffer.getvalue()),
            media_type="image/jpeg",
            filename="facedancer_result.jpg"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"臉部交換失敗: {str(e)}")

@app.post("/swap_base64")
async def face_swap_base64(
    source_face: str,
    target_image: str
):
    """臉部交換 API (Base64 格式)"""
    try:
        # 解碼 Base64
        source_data = base64.b64decode(source_face.split(',')[1] if ',' in source_face else source_face)
        target_data = base64.b64decode(target_image.split(',')[1] if ',' in target_image else target_image)
        
        # 轉換為 PIL Image
        source_image = Image.open(io.BytesIO(source_data))
        target_image = Image.open(io.BytesIO(target_data))
        
        # 執行臉部交換
        result = inference_engine.perform_face_swap(source_image, target_image)
        
        # 轉換為 Base64
        result_buffer = io.BytesIO()
        result.save(result_buffer, format='JPEG', quality=95)
        result_buffer.seek(0)
        result_base64 = base64.b64encode(result_buffer.getvalue()).decode()
        
        return {
            "success": True,
            "result": f"data:image/jpeg;base64,{result_base64}",
            "message": "臉部交換完成"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "臉部交換失敗"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
