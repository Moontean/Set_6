const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const Pop3Command = require('node-pop3');

// Настройка SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Отправка письма через SMTP
router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('SMTP Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Проверка входящих через IMAP
router.get('/check-imap', async (req, res) => {
  const config = {
    imap: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 3000,
    },
  };

  try {
    console.log('Attempting to connect to IMAP...');
    const connection = await imaps.connect(config);
    console.log('Connected to IMAP, opening INBOX...');
    await connection.openBox('INBOX');
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false };
    console.log('Searching for unseen messages...');
    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log('Messages retrieved:', messages.length);
    connection.end();
    res.json(messages);
  } catch (error) {
    console.error('IMAP Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Проверка входящих через POP3
router.get('/check-pop3', async (req, res) => {
  const pop3 = new Pop3Command({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: 'pop.gmail.com',
    port: 995,
    tls: true,
  });

  try {
    console.log('Attempting to connect to POP3...');
    const list = await pop3.LIST();
    console.log('POP3 messages retrieved:', list.length);
    res.json({ message: `${list.length} messages found`, messages: list });
    await pop3.QUIT();
  } catch (error) {
    console.error('POP3 Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;