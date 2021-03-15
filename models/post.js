module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      //id는 기본적으로 생성
      content: {
        type: DataTypes.TEXT,
        allowNull: false, //필수
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', //한글저장
    }
  );

  Post.associate = (db) => {
    db.Post.belongsTo(db.User); //게시글은 작성자에게 속해있다.
    db.Post.hasMany(db.Comment); //게시글 아래에는 댓글이 여러개 달린다.
    db.Post.hasMany(db.Image); //하나의 게시글이 이미지를 여러개 갖는다.
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashTag' }); //게시글 안에는 여러개의 해시태그가 있다.
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); //게시글 좋아요
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); //리트윗
  };

  return Post;
};
