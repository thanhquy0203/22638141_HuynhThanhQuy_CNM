const express = require("express");
const db = require("../db/mysql");
const { requireLogin } = require("./_authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

// LIST
router.get("/", requireLogin, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
  res.render("products/list", { products: rows });
});

// ADD form
router.get("/add", requireLogin, (req, res) => {
  res.render("products/add");
});


// ADD submit
// router.post("/add", requireLogin, async (req, res) => {
//   const { name, price, quantity } = req.body;
//   await db.query(
//     "INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)",
//     [name, Number(price), Number(quantity)]
//   );
//   req.flash("success", "Thêm sản phẩm thành công!");
//   res.redirect("/products");
// });
router.post(
  "/add",
  requireLogin,
  upload.single("image"),   // 🔥 BẮT BUỘC
  async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, price, quantity } = req.body;

    const imageUrl = req.file ? req.file.location : null;

    await db.query(
      "INSERT INTO products(name, price, quantity, url_image) VALUES (?, ?, ?, ?)",
      [name, Number(price), Number(quantity), imageUrl]
    );

    req.flash("success", "Thêm sản phẩm thành công!");
    res.redirect("/products");
  }
);

// EDIT form
router.get("/:id/edit", requireLogin, async (req, res) => {
  const id = req.params.id;
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  if (!rows[0]) {
    req.flash("error", "Không tìm thấy sản phẩm.");
    return res.redirect("/products");
  }
  res.render("products/edit", { product: rows[0] });
});

// EDIT submit

router.post(
  "/:id/edit",
  requireLogin,
  upload.single("image"),
  async (req, res) => {
    const { name, price, quantity } = req.body;
    const id = req.params.id;

    const [rows] = await db.query("SELECT * FROM products WHERE id=?", [id]);
    const oldImage = rows[0].url_image;

    const newImage = req.file ? req.file.location : oldImage;

    await db.query(
      "UPDATE products SET name=?, price=?, quantity=?, url_image=? WHERE id=?",
      [name, price, quantity, newImage, id]
    );

    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect("/products");
  }
);

// DELETE
router.post("/:id/delete", requireLogin, async (req, res) => {
  const id = req.params.id;
  await db.query("DELETE FROM products WHERE id = ?", [id]);
  req.flash("success", "Đã xóa sản phẩm!");
  res.redirect("/products");
});

module.exports = router;
