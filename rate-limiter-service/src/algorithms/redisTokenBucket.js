const redisClient = require('../redis');

const LUA_SCRIPT = `
  local tokens_key = KEYS[1]
  local last_refill_key = KEYS[2]
  local capacity = tonumber(ARGV[1])
  local refill_rate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])

  local tokens = tonumber(redis.call('get', tokens_key))
  if tokens == nil then
    tokens = capacity
  end

  local last_refill = tonumber(redis.call('get', last_refill_key))
  if last_refill == nil then
    last_refill = now
  end

  local elapsed_time = now - last_refill
  local tokens_to_add = elapsed_time * refill_rate
  
  tokens = math.min(capacity, tokens + tokens_to_add)
  
  redis.call('set', last_refill_key, now)

  if tokens >= 1 then
    tokens = tokens - 1
    redis.call('set', tokens_key, tokens)
    return 1
  else
    return 0
  end
`;

async function consume(id, capacity, refillRate) {
  const tokensKey = `rate-limit:token-bucket:${id}:tokens`;
  const lastRefillKey = `rate-limit:token-bucket:${id}:last_refill`;
  const now = Date.now() / 1000; // seconds

  const result = await redisClient.eval(LUA_SCRIPT, {
    keys: [tokensKey, lastRefillKey],
    arguments: [String(capacity), String(refillRate), String(now)],
  });

  return result === 1;
}

module.exports = { consume };
