module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      //id는 기본적으로 생성
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', //한글저장
    }
  );

  User.associate = (db) => {
    db.User.hasMany(db.Post); //해석: 사람이 포스트를 여러개 갖고있다.
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); //사용자와 게시글의 좋아요
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'FollowingId',
    }); //팔로워
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'FollowerId',
    }); //팔로잉
  };

  return User;
};
