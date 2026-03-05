const express = require('express');
const axios = require('axios');

const app = express();
const port = 8080;

const rateLimiterServiceUrl = 'http://rate-limiter-service:3000';
const demoApiUrl = 'http://demo-api:3001';

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    const response = await axios.post(`${rateLimiterServiceUrl}/check-limit`, {
      userId: req.headers['user-id'],
      ip: req.ip,
      endpoint: req.path,
    });

    const { allowed, remaining } = response.data;

    res.set('X-RateLimit-Limit', 10); // This should be dynamic based on rules
    res.set('X-RateLimit-Remaining', remaining);

    if (allowed) {
      // Forward the request to the demo API
      const demoApiResponse = await axios({
        method: req.method,
        url: `${demoApiUrl}${req.path}`,
        data: req.body,
        headers: req.headers,
      });
      res.status(demoApiResponse.status).send(demoApiResponse.data);
    } else {
      res.set('Retry-After', 5); // This should be dynamic
      res.status(429).send('Too Many Requests');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
