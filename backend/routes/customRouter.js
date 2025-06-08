const express = require('express');
const { uploadImage, fetchLatestDiaryInfo } = require('../controllers/customController');

const router = express.Router();

// 이미지 저장 api
router.post('/upload-image', uploadImage);

// 다이어리(제목, 생성날짜) 가져오는 api
router.get('/latest-diary', fetchLatestDiaryInfo);

module.exports = router;