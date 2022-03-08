const Redis = require('ioredis');
const safeStringify = require('fast-safe-stringify');
const koaCache = require('koa-cash');

const redis = new Redis(process.env.REDIS_URL);
const redisCache = koaCache({
  maxAge: 3600 * 1000,
  setCachedHeader: true,
  async get(key) {
    let value;
    try {
      value = await redis.get(key);
      if (value) value = JSON.parse(value);
    } catch (err) {
      console.error(err);
    }
    return value;
  },
  set(key, value, maxAge) {
    if (maxAge <= 0) return redis.set(key, safeStringify(value));
    return redis.set(key, safeStringify(value), 'EX', maxAge);
  },
});

module.exports = {
  async redisCacher(ctx, next) {
    await redisCache(ctx, next);
  },
  async cachedResponse(ctx, next) {
    const cached = await ctx.cashed();
    if (cached) {
      return;
    }
    await next();
  }
}
