const express = require('express');
const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

//게시글 작성
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image, //게시글에 달린 이미지들
        },
        {
          model: Comment, //게시글에 달린 댓글들
        },
        {
          model: User, //게시글 작성자
        },
      ],
    });

    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//댓글 작성
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id, //deserializeUse의 user로 인해 사용가능
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
