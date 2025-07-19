// Vercel 서버리스 함수로 이메일 전송
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 요청만 허용됩니다' });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: '메시지를 입력해주세요' });
    }

    // Gmail SMTP 설정 (무료!)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // blurfin.kr@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD // Gmail 앱 비밀번호
      }
    });

    // 이메일 내용 (줄바꿈 유지)
    const mailOptions = {
      from: process.env.GMAIL_USER,
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
} 
