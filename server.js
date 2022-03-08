const _ = require('lodash');
const Koa = require('koa');
const Router = require('@koa/router');
const Parser = require('./lib/Parse.js');
const ErrorHandler = require('./lib/ErrorHandler.js');
const Cache = require('./lib/Cache.js');
const app = new Koa();
const router = new Router();

// Constants
const SERVER_PORT = _.get(process.env, 'PORT', _.get(process.env, 'SERVER_PORT', 80));
const SERVER_HOST = _.get(process.env, 'HOST', _.get(process.env, 'SERVER_HOST', '0.0.0.0'));

// error handler
app.use(ErrorHandler.defaultErrorHandler);

// Caching
app.use(Cache.redisCacher);
app.use(Cache.cachedResponse);

// Routing
app.use(router
  .get('/', async ctx => { ctx.body = 'Hello OGP Tools'; })
  .get('/parse', Parser.parseOgp)
  .routes());

app.use(ErrorHandler.httpErrorFinisher);


app.listen(SERVER_PORT, SERVER_HOST);
console.log(`Running on http://${SERVER_HOST}:${SERVER_PORT}`);
