const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const customRouter = require('./routes/customRouter');
const emailRouter = require('./routes/emailRouter');

const app = express();

app.use(cors()); // CORS 허용
app.use(bodyParser.json({ limit: '10mb' })); // JSON 바디 파서, 최대 용량 10MB

// 이미지 다운로드 전용 라우터
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.download(filePath, filename, err => {
    if (err) {
      console.error('파일 다운로드 실패:', err);
      res.status(404).send('파일을 찾을 수 없습니다.');
    }
  });
});

app.use('/', customRouter); // 커스텀 관련 라우터 등록
app.use('/', emailRouter);  // 이메일 관련 라우터 등록

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`); // 서버 시작 로그 출력
});