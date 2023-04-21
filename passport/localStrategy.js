//로그인 과정을 어떻게 처리할지 설명하는 파일
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: false,
      }, //첫번째 인수에서 넣어준 email,password가 async함수의 첫번째와 두번째 매개변수
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            // 비밀번호 비교
            if (result) {
              //서버에러       // 두번째 인수로 사용자 정보
              done(null, exUser); //로그인이 성공
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
