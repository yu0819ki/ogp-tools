const Redis = require('ioredis');
const safeStringify = require('fast-safe-stringify');
const koaCache = require('koa-cash');

let redisCache = null;
const activateRedis = () => {
  if (!process.env.REDIS_URL) {
    return false;
  }
  if (!redisCache) {
    const redis = new Redis(process.env.REDIS_URL);
    redisCache = koaCache({
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
  }
  return true;
}
const isEnabled = activateRedis();

module.exports = {
  isEnabled,
  async redisCacher(ctx, next) {
    if (!isEnabled) {
      await next();
      return;
    }
    await redisCache(ctx, next);
  },
  async cachedResponse(ctx, next) {
    if (!isEnabled) {
      await next();
      return;
    }
    const cached = await ctx.cashed();
    if (cached) {
      return;
    }
    await next();
  }
}
