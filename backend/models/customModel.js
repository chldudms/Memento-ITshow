const db = require('../db');

// diary_custom 테이블에 새 레코드 삽입 (diaryId, 이미지 경로, 생성시간)
async function insertDiaryCustom(diaryId, imagePath) {
  const sql = `
    INSERT INTO diary_custom (diary_id, image_path, created_at)
    VALUES (?, ?, NOW())
  `;
  const [result] = await db.execute(sql, [diaryId, imagePath]);
  return result.insertId;  // 삽입된 레코드의 ID 반환
}

// diary_custom 테이블에서 id로 단일 레코드 조회
async function getCustomById(id) {
  const sql = `SELECT * FROM diary_custom WHERE id = ?`;
  const [rows] = await db.execute(sql, [id]);
  return rows[0];  // 첫 번째 결과 반환
}

// diary 테이블에서 가장 최근 생성된 diary id 조회
async function getLastDiaryId() {
  const [rows] = await db.query('SELECT id FROM diary ORDER BY id DESC LIMIT 1');
  return rows.length ? rows[0].id : null;  // 없으면 null 반환
}

// diary 테이블에서 가장 최근 다이어리의 title과 created_at 조회
async function getLatestDiaryInfo() {
  const sql = `SELECT title, created_at FROM diary ORDER BY id DESC LIMIT 1`;
  const [rows] = await db.query(sql);
  return rows.length ? rows[0] : null;
}

module.exports = {
  insertDiaryCustom,
  getCustomById,
  getLastDiaryId,
  getLatestDiaryInfo,
};
