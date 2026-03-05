const redis = require('redis');

const client = redis.createClient({
  url: 'redis://redis:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

connectRedis();

module.exports = client;
