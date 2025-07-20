import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

app.post('/api/send-email', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: '메시지를 입력해주세요' 
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER || 'blurfin.kr@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER || 'blurfin.kr@gmail.com',
      to: 'blurfin.kr@gmail.com',
      subject: 'BlurFin 사용자 피드백',
      html: `
        <h3>새로운 피드백이 도착했습니다!</h3>
        <p><strong>전송 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
        <p><strong>내용:</strong></p>
        <div style="
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
          white-space: pre-wrap;
          font-family: inherit;
          margin: 15px 0;
        ">${message}</div>
        <hr>
        <p style="color: #666; font-size: 12px;">BlurFin 인트로 페이지에서 전송됨</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: '피드백이 성공적으로 전송되었습니다!' 
    });

  } catch (error) {
    console.error('이메일 전송 오류:', error);
    return res.status(500).json({ 
      success: false, 
      message: '전송 중 오류가 발생했습니다.' 
    });
  }
});

app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.json({ message: 'BlurFin 백엔드 서버가 실행 중입니다!' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT}에서 실행 중입니다!`);
}); 
