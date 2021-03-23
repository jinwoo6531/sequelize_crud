const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User, Post } = require('../models');
const router = express.Router();

// 1. /auth/kakao로 로그인 요청
// router.get('/kakao', passport.authenticate('kakao'));

// // 3. /auth/kakao/callback으로 프로필 반환
// router.get(
//   '/kakao/callback',
//   // done에 오류값이 전달되면 "/"로 리다이렉트합니다.
//   passport.authenticate('kakao', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/');
//   }
// );

router.get('/', (req,res,next) => {
  try {
    if(req.user) {      

      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          //프론트에 비밀번호만 빼고 넘겨준다.
          exclude: ['password'],
        },
        include: [
          {
            model: Post,
            attributes: ['id']
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id']
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id']
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);  
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
  
})



//로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
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

//로그아웃
router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send('로그아웃 성공');
});

//회원가입
router.post('/', isNotLoggedIn, async (req, res, next) => {
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
