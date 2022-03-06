const _ = require('lodash');
const Koa = require('koa');
const app = new Koa();

// Constants
const SERVER_PORT = _.get(process.env, 'PORT', _.get(process.env, 'SERVER_PORT', 80));
const SERVER_HOST = _.get(process.env, 'HOST', _.get(process.env, 'SERVER_HOST', 80));

// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(SERVER_PORT, SERVER_HOST);
console.log(`Running on http://${SERVER_HOST}:${SERVER_PORT}`);
