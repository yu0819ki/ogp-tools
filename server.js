const createError = require('http-errors');
const _ = require('lodash');
const qs = require('qs');
const { unfurl } = require('unfurl.js');
const { FetchError } = require('node-fetch');
const Koa = require('koa');
const router = require('koa-path-match')();
const app = new Koa();

// Constants
const SERVER_PORT = _.get(process.env, 'PORT', _.get(process.env, 'SERVER_PORT', 80));
const SERVER_HOST = _.get(process.env, 'HOST', _.get(process.env, 'SERVER_HOST', '0.0.0.0'));

// response
app.use(router('/')
  .get(async ctx => {
    ctx.body = 'Hello Koa';
  }));
app.use(router('/parse')
  .get(async ctx => {
    const url = _.get(qs.parse(ctx.request.querystring), 'url');
    if (!url) {
      throw createError(400);
    }
    try {
      ctx.body = await unfurl(url, {
        oembed: true,
        timeout: 300000,
        userAgent: 'facebookexternalhit;ogp-tools-parser/0.1',
      });
    } catch (e) {
      if (e instanceof FetchError && e.type === 'request-timeout') {
        throw createError(504);
      }
      throw e;
    }
  }));

app.listen(SERVER_PORT, SERVER_HOST);
console.log(`Running on http://${SERVER_HOST}:${SERVER_PORT}`);
