const Session = require('../models/Session');

module.exports.me = async function me(ctx, next) {
  const authHeader = ctx.request.get('Authorization');
  if (!authHeader) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const session = await Session.findOne({token}).populate('user');
  if (session === null) {
    ctx.status = 401;
    ctx.body = {error: 'Неверный аутентификационный токен'};
    return;
  }

  session.lastVisit = new Date();
  await session.save();

  ctx.user = session.user;
  ctx.body = {
    email: ctx.user.email,
    displayName: ctx.user.displayName,
  };
  return next();
};
