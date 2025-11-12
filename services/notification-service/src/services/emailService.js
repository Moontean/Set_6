const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, use ethereal email or configure with real SMTP
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Fallback to console logging for development
  return null;
};

const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email would be sent:');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Text: ${text}`);
      return { success: true, message: 'Email logged (no transporter configured)' };
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@cvplatform.com',
      to,
      subject,
      text,
      html
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
