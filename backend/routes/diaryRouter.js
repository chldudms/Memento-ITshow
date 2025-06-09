const express = require('express');
const db = require('../db');

const router = express.Router();

// 다이어리 저장
router.post('/addDiary', async (req, res) => {
    const { diaryTitle, coverColor, hashtag, showSticker, diaryKey } = req.body;

    console.log("받은 데이터:", req.body); 
    try {
        await db.query(
            `INSERT INTO diary (title, color, hashtags, sticker, password) VALUES (?, ?, ?, ?, ?)`,
            [diaryTitle, coverColor, hashtag, showSticker, diaryKey]
        );

        res.status(200).send("저장 성공!");
    } catch (err) {
        console.error("DB 에러:", err); // 👈 어디서 문제인지 추적하기 쉽도록!
        res.status(500).send("서버 에러!");
    }
});

// // 다이어리 목록 로드 
// router.get('/loadDiarys', );
// // 다이어리 내용 조회
// router.get('/loadDiary/:diaryId', );

module.exports = router;