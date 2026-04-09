const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const ACTIVE_MODEL = process.env.GROQ_MODEL || DEFAULT_MODEL;
console.log(`Groq model: ${ACTIVE_MODEL}`);

function callGroq(message, apiKey, model) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model,
      messages: [{ role: 'user', content: message }],
      max_tokens: 1024
    });

    const req = https.request(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          let data;
          try {
            data = JSON.parse(raw || '{}');
          } catch (err) {
            return reject(new Error('Groq API noto\'g\'ri JSON qaytardi.'));
          }

          if (res.statusCode < 200 || res.statusCode >= 300) {
            const msg = data?.error?.message || `Groq API xatolik qaytardi. Status: ${res.statusCode}`;
            const error = new Error(msg);
            error.statusCode = res.statusCode;
            return reject(error);
          }

          resolve(data);
        });
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  // API key tekshirish
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'API key topilmadi. .env faylini tekshiring.' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Xabar bo\'sh bo\'lishi mumkin emas.' });
  }

  const model = ACTIVE_MODEL;

  try {
    const data = await callGroq(message, process.env.GROQ_API_KEY, model);
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(502).json({ error: 'Groq API javobi kutilmagan formatda.' });
    }
    res.json({ reply });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Server xatoligi.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ishlamoqda: http://localhost:${PORT}`);
});
