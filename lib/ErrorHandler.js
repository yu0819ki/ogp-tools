const createError = require("http-errors");
module.exports = {
  async defaultErrorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // will only respond with JSON
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = {
        message: err.message
      };
    }
  },

  async httpErrorFinisher(ctx, next) {
    if (ctx.response.status >= 400) {
      throw createError(ctx.response.status);
    }
    await next();
  }
}
