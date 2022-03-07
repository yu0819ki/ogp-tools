const createError = require('http-errors');
const _ = require('lodash');
const qs = require('qs');
const { unfurl } = require('unfurl.js');
const { FetchError } = require('node-fetch');

module.exports = {
  async parseOgp(ctx) {
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
  }
}
