const express = require('express');
const router = express.Router();
const rateLimiterService = require('../services/rateLimiter');

router.post('/check-limit', async (req, res) => {
  try {
    const result = await rateLimiterService.checkLimit(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/metrics', (req, res) => {
  res.json(rateLimiterService.getMetrics());
});

module.exports = router;
