const express = require('express');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// POST /api/notify/email - Send email notification
router.post('/email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'to and subject are required' });
    }

    if (!text && !html) {
      return res.status(400).json({ error: 'Either text or html content is required' });
    }

    const result = await sendEmail(to, subject, text, html);

    res.json({
      message: 'Email sent successfully',
      result
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email', message: error.message });
  }
});

// POST /api/notify/push - Send push notification (stub)
router.post('/push', async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ error: 'userId, title, and body are required' });
    }

    // TODO: Implement push notification logic
    console.log('Push notification would be sent:');
    console.log(`UserId: ${userId}`);
    console.log(`Title: ${title}`);
    console.log(`Body: ${body}`);
    console.log(`Data: ${JSON.stringify(data)}`);

    res.json({
      message: 'Push notification sent successfully (stub)',
      notification: { userId, title, body, data }
    });
  } catch (error) {
    console.error('Send push notification error:', error);
    res.status(500).json({ error: 'Failed to send push notification', message: error.message });
  }
});

module.exports = router;
