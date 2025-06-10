const fs = require('fs').promises; // fs의 프로미스 버전 사용 (await 가능)
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getLastDiaryId, insertDiaryCustom, getLatestDiaryInfo } = require('../models/customModel');

async function uploadImage(req, res) {
  const { image } = req.body;

  // 이미지 데이터가 없으면 400 에러 반환
  if (!image) {
    return res.status(400).json({ error: "image가 필요합니다." });
  }

  // base64 헤더 제거
  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  // 고유한 파일명 생성
  const fileName = `diary_${uuidv4()}.png`;
  // 저장할 경로 설정
  const filePath = path.join(__dirname, '..', 'uploads', fileName);

  try {
    // 이미지 파일을 base64 인코딩으로 저장
    await fs.writeFile(filePath, base64Data, 'base64');
  } catch (fileErr) {
    // 파일 저장 실패 시 에러 반환
    console.error('파일 저장 실패:', fileErr);
    return res.status(500).json({ error: "파일 저장 실패" });
  }

  // 저장된 이미지 URL 생성
  const imageUrl = `http://localhost:5001/uploads/${fileName}`;

  try {
    // 최근 다이어리 ID 조회
    const diaryId = await getLastDiaryId();
    // 이미지 URL을 diary_custom 테이블에 저장
    const insertId = await insertDiaryCustom(diaryId, imageUrl);
    // 성공 응답 반환
    return res.json({ imageUrl, insertId });
  } catch (dbErr) {
    // DB 저장 실패 시 에러 반환
    console.error('DB 저장 실패:', dbErr);
    return res.status(500).json({ error: "DB 저장 실패" });
  }
}

async function fetchLatestDiaryInfo(req, res) {
  try {
    // 최신 다이어리 정보 조회
    const diary = await getLatestDiaryInfo();
    if (!diary) {
      // 다이어리 없으면 404 반환
      return res.status(404).json({ error: '다이어리가 없습니다.' });
    }
    // 조회 성공 시 다이어리 정보 반환
    res.json(diary);
  } catch (error) {
    // 조회 실패 시 서버 에러 반환
    console.error("다이어리 조회 실패:", error);
    res.status(500).json({ error: "서버 에러" });
  }
}

module.exports = {
  uploadImage,
  fetchLatestDiaryInfo,
};
