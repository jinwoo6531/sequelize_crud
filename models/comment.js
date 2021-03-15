module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
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

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); //댓글은 작성자에게 속해있다.
    db.Comment.belongsTo(db.Post); //댓글은 게시글에 속해있다.
  };

  return Comment;
};
