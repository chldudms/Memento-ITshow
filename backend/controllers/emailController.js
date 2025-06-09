require('dotenv').config();
const nodemailer = require('nodemailer');
const {
  insertEmailDownload,
  getLatestDiaryCustomId,
  getImageUrlByCustomId,
} = require('../models/emailModel');

async function sendEmailWithAttachment(toEmail, imageUrl) {
  // Gmail SMTP 설정 및 인증
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,   // .env 파일에서 이메일 계정
      pass: process.env.EMAIL_PASS,   // .env 파일에서 앱 비밀번호
    },
  });

  // 이메일 내용 및 첨부파일 설정
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Memento 다이어리 이미지 전송',
    text: '첨부된 이미지 파일을 확인해주세요.',
    attachments: [
      {
        path: imageUrl,  // 이미지 URL을 첨부파일로 지정
      },
    ],
  };

  // 이메일 전송
  await transporter.sendMail(mailOptions);
}

async function saveEmailAndSend(req, res) {
  let { customId, email } = req.body;

  // 이메일 미입력 시 400 에러 반환
  if (!email) {
    return res.status(400).json({ error: 'email 필요합니다.' });
  }

  try {
    // customId 없으면 가장 최신 다이어리 customId 조회
    if (!customId) {
      customId = await getLatestDiaryCustomId();
      if (!customId) {
        return res.status(400).json({ error: '저장된 다이어리가 없습니다.' });
      }
    }

    // 이메일 저장
    await insertEmailDownload(customId, email);

    // 이미지 URL 조회
    const imageUrl = await getImageUrlByCustomId(customId);
    if (!imageUrl) {
      return res.status(400).json({ error: '이미지 URL을 찾을 수 없습니다.' });
    }

    // 이미지 첨부해 이메일 전송
    await sendEmailWithAttachment(email, imageUrl);

    // 성공 응답 반환
    res.json({ message: '이메일 전송 완료' });
  } catch (error) {
    console.error('이메일 처리 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
}

module.exports = {
  saveEmailAndSend,
};