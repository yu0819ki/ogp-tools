const ratelimit = require('koa-ratelimit');
const db = new Map();
const limitationManager = ratelimit({
  driver: 'memory',
  db: db,
  duration: process.env.LIMITER_DURATION || 60000,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: process.env.LIMITER_MAX || 100,
  disableHeader: false,
  whitelist: (ctx) => {
    // some logic that returns a boolean
  },
  blacklist: (ctx) => {
    // some logic that returns a boolean
  },
  throw: true,
});
module.exports = {
  async rateLimitation(ctx, next) {
    await limitationManager(ctx, next);
  }
}
