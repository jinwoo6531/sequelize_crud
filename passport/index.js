const passport = require('passport');
const local = require('./local');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); //첫번째 인자는 서버에서, 두번쨰는 성공
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); //req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
