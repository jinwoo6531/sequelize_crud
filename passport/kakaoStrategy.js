const passport = require('passport');
const { User } = require('../models');
const { Strategy: KakaoStrategy } = require('passport-kakao');

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: '', // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL: 'http://localhost:3065/auth/kakao/callback',
    },
    async (_, __, profile, cb) => {
      const {
        id,
        username: name,
        _json: {
          properties: { profile_image },
          kakao_account: { email },
        },
      } = profile;
      try {
        const user = await User.findOne({ email });
        if (user) {
          user.kakaoId = id;
          user.save();
          return cb(null, user);
        } else {
          const newUser = await User.create({
            email,
            name,
            kakaoId: id,
            avartarUrl: profile_image,
          });
          return cb(null, newUser);
        }
      } catch (error) {
        return cb(error);
      }
    }
  )
);
