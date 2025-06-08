const express = require('express');
const { saveEmailAndSend } = require('../controllers/emailController');

const router = express.Router();

// 이메일 전송 api
router.post('/send-email', saveEmailAndSend);

module.exports = router;