const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();

  subscribers[id] = ctx.res;
  const message = new Promise((resolve, reject) => {
    subscribers[id] = resolve;
  });
  ctx.body = await message;
  ctx.res.on('close', function() {
    delete subscribers[id];
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message || !Object.keys(subscribers).length) return;
  Object.keys(subscribers).forEach((id) => subscribers[id](message));
  subscribers = {};
  return ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
