const _ = require('lodash');
const Koa = require('koa');
const router = require('koa-path-match')();
const Parser = require('./lib/Parse.js');
const app = new Koa();

// Constants
const SERVER_PORT = _.get(process.env, 'PORT', _.get(process.env, 'SERVER_PORT', 80));
const SERVER_HOST = _.get(process.env, 'HOST', _.get(process.env, 'SERVER_HOST', '0.0.0.0'));

// default error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;;
    ctx.body = {
      message: err.message
    };
  }
});

// response
app.use(router('/')
  .get(async ctx => {
    ctx.body = 'Hello Koa';
  }));
app.use(router('/parse')
  .get(parser.parseOgp));

app.listen(SERVER_PORT, SERVER_HOST);
console.log(`Running on http://${SERVER_HOST}:${SERVER_PORT}`);
