const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { User, Post } = require('../models');
const router = express.Router();

// 1. /auth/kakao로 로그인 요청
router.get('/kakao', passport.authenticate('kakao'));

// 3. /auth/kakao/callback으로 프로필 반환
router.get(
  '/kakao/callback',
  // done에 오류값이 전달되면 "/"로 리다이렉트합니다.
  passport.authenticate('kakao', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

//비밀번호 찾기
router.post('/forget-password', async (req, res, next) => {
  if (req.body.email === '') {
    res.status(400).send('이메일은 필수값');
  }
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).send('사용자가 없습니다.');
    }

    let generateRandom = function (min, max) {
      let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
      return ranNum;
    };

    const number = generateRandom(111111, 999999);
    const email = {
      service: 'gmail',
      port: 587,
      host: 'smtp.gmail.com',
      secure: false,
      requireTLS: true,
      auth: {
        user: '',
        pass: '',
      },
    };
    const send = async (data) => {
      nodemailer.createTransport(email).sendMail(data, function (error, info) {
        if (error) {
          console.log(11);
          console.error(error);
        } else {
          console.log(info);
          return info.response;
        }
      });
    };

    const content = {
      from: email,
      to: 'dlgksdud23@naver.com',
      subject: '[플로잉]인증 관련 이메일 입니다',
      text: '오른쪽 숫자 6자리를 입력해주세요 : ' + number,
    };

    send(content);
  } catch (error) {
    console.error(error);
  }
});

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
    return req.login(user, async (loginErr) => {
      //살면서 한번도 못봄 에러나는거
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      //일반정보가 아닌 사용자가 작성한 게시글 정보를 가져다줌
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          //프론트에 비밀번호만 빼고 넘겨준다.
          exclude: ['password'],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: 'Followings',
          },
          {
            model: User,
            as: 'Followers',
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword); //최종 : 프론트로 사용자 정보 제공
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.status(200).send('로그아웃 성공');
});

//회원가입
router.post('/', async (req, res, next) => {
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
