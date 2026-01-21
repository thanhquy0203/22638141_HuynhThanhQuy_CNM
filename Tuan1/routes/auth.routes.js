const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/mysql");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  const user = rows[0];

  if (!user) {
    req.flash("error", "Sai tài khoản hoặc mật khẩu.");
    return res.redirect("/login");
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    req.flash("error", "Sai tài khoản hoặc mật khẩu.");
    return res.redirect("/login");
  }

  req.session.user = { id: user.id, username: user.username };
  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/products");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;




