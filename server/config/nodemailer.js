import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,  // your Gmail
    pass: process.env.SMTP_PASS      // Gmail App Password
  }
});

export default transporter;
