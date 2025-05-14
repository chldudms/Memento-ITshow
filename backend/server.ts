import express, { Application } from 'express';
const app: Application = express();
const port: number = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 서버 실행
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
