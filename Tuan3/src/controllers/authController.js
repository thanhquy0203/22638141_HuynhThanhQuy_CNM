const authService = require("../services/authService");

exports.getLogin = (req, res) => res.render("auth/login");

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const u = await authService.login(username, password);
  if (!u) {
    req.flash("error", "Sai tài khoản hoặc mật khẩu.");
    return res.redirect("/login");
  }
  req.session.user = u;
  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/products");
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
