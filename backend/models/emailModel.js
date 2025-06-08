const db = require('../db');

// email_download 테이블에 customId와 email을 삽입
async function insertEmailDownload(customId, email) {
  const sql = `INSERT INTO email_download (custom_id, email) VALUES (?, ?)`;
  const [result] = await db.execute(sql, [customId, email]);
  return result;  // 삽입 결과 반환
}

// diary_custom 테이블에서 가장 최근에 생성된 레코드의 id 조회
async function getLatestDiaryCustomId() {
  const sql = `SELECT id FROM diary_custom ORDER BY created_at DESC LIMIT 1`;
  const [rows] = await db.execute(sql);
  return rows.length ? rows[0].id : null;  // 없으면 null 반환
}

// diary_custom 테이블에서 customId에 해당하는 이미지 경로 조회
async function getImageUrlByCustomId(customId) {
  const sql = `SELECT image_path FROM diary_custom WHERE id = ?`;
  const [rows] = await db.execute(sql, [customId]);
  return rows.length ? rows[0].image_path : null;  // 없으면 null 반환
}

module.exports = {
  insertEmailDownload,
  getLatestDiaryCustomId,
  getImageUrlByCustomId,
};