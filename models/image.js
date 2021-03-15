module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      //id는 기본적으로 생성
      src: {
        type: DataTypes.STRING(200),
        allowNull: false, //필수
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', //한글저장
    }
  );

  Image.associate = (db) => {
    db.Image.belongsTo(db.Post); //이미지는 게시글에 속해있다.
  };

  return Image;
};
