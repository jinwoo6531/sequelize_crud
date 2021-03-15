const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');

const router = express.Router();

//로그인
router.post('/login', (req, res, next) => {
  //미들웨어 확장
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      //서버쪽 에러
      console.error(err);
      return next(err);
    }
    if (info) {
      //클라이언트 에러
      return res.status(403).send(info.reason);
    }

    //진짜 로그인
    return req.login(user, async (loginerr) => {
      //살면서 한번도 못봄 에러나는거
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.json(user); //최종 : 프론트로 사용자 정보 제공
    });
  })(req, res, next);
});

//회원가입
router.post('/', async (req, res, next) => {
  console.log(req.email);
  //POST /user
  try {
    //유저존재 먼저 체크
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await User.create({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      phone: req.body.phone,
    });
    res.send('회원가입 성공입니다. 한영님');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
