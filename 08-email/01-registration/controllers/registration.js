const {v4: uuid} = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');

function onErrorHandler(ctx, msg) {
  ctx.status = 400;
  ctx.body = msg;
}

module.exports.register = async (ctx, next) => {
  const {displayName, email, password} = ctx.request.body;
  const verificationToken = uuid();
  try {
    // await User.deleteOne({email}); // Only for local tests
    const user = await User.create({
      displayName,
      email,
      verificationToken,
    });
    await user.setPassword(password);
    await user.save();

    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });
    ctx.body = {status: 'ok'};
  } catch (err) {
    if (err.errors) {
      const errors = {};
      Object.keys(err.errors).forEach((field) => {
        errors[field] = err.errors[field].message;
      });
      return onErrorHandler(ctx, {errors});
    } else {
      // EAUTH error
      return onErrorHandler(ctx, {error: 'Ошибка EAUTH, обратитесь к Администратору'});
    }
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  if (verificationToken) {
    const user = await User.findOne({verificationToken});
    if (user) {
      user.verificationToken = undefined;
      await user.save();
      const token = uuid();
      await Session.create({
        token,
        user: user.id,
        lastVisit: new Date(),
      });
      ctx.body = {token};
      return;
    }
  }
  return onErrorHandler(ctx, {error: 'Ссылка подтверждения недействительна или устарела'});
};
