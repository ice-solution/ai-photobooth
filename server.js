const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// 中間件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 建立上傳目錄
const uploadPath = path.resolve(process.env.UPLOAD_PATH || './uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// 靜態檔案服務
app.use('/uploads', express.static(uploadPath));
app.use('/public', express.static(path.join(__dirname, 'public')));

// 連接 MongoDB
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 連接成功'))
.catch(err => console.error('MongoDB 連接失敗:', err));

// 路由
app.use('/api/voice', require('./routes/voice'));
app.use('/api/profession', require('./routes/profession'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/faceswap', require('./routes/faceswap'));

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI 志願生成器服務正常運行' });
});

// 生產環境下提供 React 應用
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
