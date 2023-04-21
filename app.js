const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
// passport연결 -검증된 모듈,, 구글,페이스북, 카카오톡 같은 여러 ~
// passport 관련 패키들  passport-local,passport-kakao,bcrypt
const passport = require("passport");

dotenv.config();
const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");

// npx sequelize db:create 하여 데이터베이스 생성 후 모델과 서버 연결
const { sequelize } = require("./models");

// 같은 폴더내의 index.js파일 이름은 생략가능
const passportConfig = require("./passport");

const app = express();
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

//sequelize 서버세팅
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
// 요청(req)에 passport설정을 심음
app.use(passport.initialize());
// req.session객체에 passport 정보 저장
app.use(passport.session());

app.use("/", pageRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
