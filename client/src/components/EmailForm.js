import React, { useState } from 'react';
import axios from 'axios';

const EmailForm = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/email/send', { to, subject, text });
      alert('Email sent!');
    } catch (error) {
      alert(`Failed to send email: ${error.message}`);
    }
  };

  const checkImap = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/email/check-imap');
      console.log('IMAP messages:', response.data);
    } catch (error) {
      console.error('IMAP check failed:', error.message);
    }
  };

  const checkPop3 = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/email/check-pop3');
      console.log('POP3 messages:', response.data);
    } catch (error) {
      console.error('POP3 check failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Recipient"
          required
        />
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          required
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
          required
        />
        <button type="submit">Send Email</button>
      </form>
      <button onClick={checkImap}>Check IMAP</button>
      <button onClick={checkPop3}>Check POP3</button>
    </div>
  );
};

export default EmailForm;