const express = require('express');
const app = express();
const port = 3001;

app.get('/api/orders', (req, res) => {
  res.json({ message: 'GET /api/orders successful' });
});

app.get('/api/profile', (req, res) => {
  res.json({ message: 'GET /api/profile successful' });
});

app.post('/api/payment', (req, res) => {
  res.json({ message: 'POST /api/payment successful' });
});

app.listen(port, () => {
  console.log(`Demo API listening at http://localhost:${port}`);
});
