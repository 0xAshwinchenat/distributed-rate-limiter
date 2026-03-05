const tokenBucket = require('../algorithms/redisTokenBucket');
// const slidingWindow = require('../algorithms/slidingWindow');
const redisClient = require('../redis');

// Example rule: 10 requests per minute
const rules = {
  default: {
    // algorithm: 'tokenBucket',
    capacity: 10,
    refillRate: 10 / 60, // 10 tokens per 60 seconds
  },
  '/api/orders': {
    // algorithm: 'slidingWindow',
    // windowSizeInSeconds: 60,
    // limit: 5,
    capacity: 5,
    refillRate: 5 / 60,
  },
};

const metrics = {
  totalRequests: 0,
  allowedRequests: 0,
  blockedRequests: 0,
};

async function checkLimit(data) {
  metrics.totalRequests++;
  const { userId, ip, endpoint } = data;

  // Prioritize userId, then IP, for rate limiting
  const id = userId || ip;

  const rule = rules[endpoint] || rules.default;

  // const algorithm = rule.algorithm || 'tokenBucket';
  let allowed;

  // if (algorithm === 'slidingWindow') {
  //   allowed = await slidingWindow.consume(id, rule.windowSizeInSeconds, rule.limit);
  // } else {
  //   allowed = await tokenBucket.consume(id, rule.capacity, rule.refillRate);
  // }
  
  allowed = await tokenBucket.consume(id, rule.capacity, rule.refillRate);

  if (allowed) {
    metrics.allowedRequests++;
  } else {
    metrics.blockedRequests++;
  }

  const tokensKey = `rate-limit:token-bucket:${id}:tokens`;
  const remaining = await redisClient.get(tokensKey);

  return {
    allowed,
    remaining: Math.floor(remaining),
  };
}

function getMetrics() {
  return metrics;
}

module.exports = { checkLimit, getMetrics };
