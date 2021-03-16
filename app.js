const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(
  cors({
    origin: true,
    credentials: false,
  })
);
passportConfig();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

db.sequelize
  .sync()
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch(console.error);

app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
  console.log('서버 실행중');
});
