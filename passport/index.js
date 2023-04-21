const passport = require("passport");
const local = require("./localStrategy.js");

const User = require("../models/user");

// serializeUser는 로그인시 실행
// req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
// 매개변수user받고 done함수에 두번째 인수로user.id
// 사용자 정보가 들어있음
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
    // done(에러발생시사용,저장하고싶은데이터)
    // 로그인시 사용자의 데이터를 모두 저장하면 세션의 용량이 커지고 데이터 일관성에 문제발생,, 아이디만 저장
  });

  // deserializeUser는 각 요청마다 실행됨
  // serializeUser done두번째 인수로 넣었던 데이터가 매개변수가됨
  // serializeUser에 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보 조히
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      //req.user에 저장
      .catch((err) => done(err));
  });

  local();
};
