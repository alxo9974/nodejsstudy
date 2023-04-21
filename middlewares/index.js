// 미들웨어 : 라우터에 접근제한을 제어,,

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인을 해주세요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인된 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
