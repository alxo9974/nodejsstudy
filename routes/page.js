const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { renderProfile, renderJoin, renderMain } = require("../controllers/page");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next();
}); // 라우터용 미들웨어를 만들어 템플릿 엔진에서 사용할 변수를 res.locals 로 설정 , 나중에 값을 넣을거야
// res.locals인 이유는 모든 템플릿엔진에서 공통으로 사용

router.get("/profile", isLoggedIn, renderProfile);
// 라우터의 마지막에 위치해 클라이언트에게 응답을 보내는 미들웨어를 컨트롤러라고 함

router.get("/join", isNotLoggedIn, renderJoin);

router.get("/", renderMain);

module.exports = router;
