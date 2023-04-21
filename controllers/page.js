exports.renderProfile = (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
};

exports.renderJoin = (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
};

// 메인페이지를 렌더링하면서 넌적스에 게시글 목록(twits)을 전달
// 나중에 값을 넣어,,

exports.renderMain = (req, res, next) => {
  const twits = [];
  res.render("main", {
    title: "NodeBird",
    twits,
  });
};
