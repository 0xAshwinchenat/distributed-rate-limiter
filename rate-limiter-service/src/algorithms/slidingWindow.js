const redisClient = require('../redis');

async function consume(id, windowSizeInSeconds, limit) {
  const key = `rate-limit:sliding-window:${id}`;
  const now = Date.now();
  const windowStart = now - windowSizeInSeconds * 1000;

  const [_, __, count] = await redisClient
    .multi()
    .zRemRangeByScore(key, 0, windowStart)
    .zAdd(key, { score: now, value: String(now) })
    .zCard(key)
    .exec();

  return count <= limit;
}

module.exports = { consume };
