const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User.js');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      User.findOne({email}, async function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, 'Нет такого пользователя'); // DON'T USE IN PROD

        const isVerified = await user.checkPassword(password);
        return isVerified
          ? done(null, user)
          : done(null, false, 'Неверный пароль')
        ;
      });
    },
);
