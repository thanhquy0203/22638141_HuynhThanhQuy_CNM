function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  if (req.session.user.role !== "admin") {
    req.flash("error", "Chỉ admin mới được phép thao tác.");
    return res.redirect("/products");
  }
  next();
}

module.exports = { requireLogin, requireAdmin };
