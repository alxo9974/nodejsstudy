const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");

exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    //이메일 조회
    const exUser = await User.findOne({ where: { email } });

    if (exUser) {
      //같은 이메일이 있으면 에러를,,
      return res.redirect("/join?error=exist");
    }
    //없으면 ?
    const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화
    // 사용자 정보를 생성
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// 로그인 요청이 들어오면
exports.login = (req, res, next) => {
  // 로컬 로그인 전략 수행
  // 전략이 성공하거나 실패하면 콜백함수가 실행
  // authErr에 값이 있으면 실패,,
  //사용자정보
  // req.login 메서를 호출
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    // passport.serializeUser를 호출하고 user객체가 serializeUser로 넘어감
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  //logout메서드는 콜백함수를 인수로받고, 세션정보를 지운후 콜백 함수가 실행
  req.logout(() => {
    res.redirect("/");
  });
};
