const express = require('express');
const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  //GET /posts

  try {
    const posts = await Post.findAll({
      limit: 10, //게시글 10개만 가져오기
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //댓글 내림차순
      ], //최신글부터 가져오기
      include: [
        {
          model: User, //작성자 정보 가져오기
          attributes: ['id', 'nickname'],
        },
        {
          model: Image, //게시글의 이미지도 가져오기
        },
        {
          model: Comment,
          include: [
            {
              model: User, //댓글 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, //좋아요 누른사람
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
