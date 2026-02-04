const productService = require("../services/productService");
const categoryService = require("../services/categoryService");

exports.list = async (req, res) => {
  const { q, categoryId, minPrice, maxPrice, limit, lastKey } = req.query;
  const { items, nextKey } = await productService.list({ q, categoryId, minPrice, maxPrice, limit, lastKey });
  const categories = await categoryService.listAll();

  res.render("products/list", {
    products: items,
    categories,
    filters: { q, categoryId, minPrice, maxPrice, limit: limit || 10 },
    nextKey: nextKey ? JSON.stringify(nextKey) : null
  });
};

exports.getAdd = async (req, res) => {
  const categories = await categoryService.listAll();
  res.render("products/add", { categories });
};

exports.postAdd = async (req, res) => {
  const { name, price, quantity, categoryId } = req.body;
  const url_image = req.file ? req.file.location : null;

  await productService.create(
    { name, price, quantity, categoryId, url_image },
    req.session.user.userId
  );

  req.flash("success", "Thêm sản phẩm thành công!");
  res.redirect("/products");
};

exports.getEdit = async (req, res) => {
  const product = await productService.getById(req.params.id);
  if (!product || product.isDeleted) {
    req.flash("error", "Không tìm thấy sản phẩm.");
    return res.redirect("/products");
  }
  const categories = await categoryService.listAll();
  res.render("products/edit", { product, categories });
};

exports.postEdit = async (req, res) => {
  const id = req.params.id;
  const old = await productService.getById(id);
  if (!old || old.isDeleted) return res.redirect("/products");

  const { name, price, quantity, categoryId } = req.body;
  const url_image = req.file ? req.file.location : old.url_image;

  await productService.update(
    id,
    { name, price, quantity, categoryId, url_image },
    req.session.user.userId
  );

  req.flash("success", "Cập nhật thành công!");
  res.redirect("/products");
};

exports.postDelete = async (req, res) => {
  await productService.softDelete(req.params.id, req.session.user.userId, true);
  req.flash("success", "Đã xoá (soft delete)!");
  res.redirect("/products");
};
