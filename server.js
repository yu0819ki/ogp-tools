const _ = require('lodash');
const Koa = require('koa');
const Router = require('@koa/router');
const Parser = require('./lib/Parse.js');
const app = new Koa();
const router = new Router();

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
// Routing
app.use(router
  .get('/', async ctx => { ctx.body = 'Hello OGP Tools'; })
  .get('/parse', Parser.parseOgp)
  .routes());



app.listen(SERVER_PORT, SERVER_HOST);
console.log(`Running on http://${SERVER_HOST}:${SERVER_PORT}`);
