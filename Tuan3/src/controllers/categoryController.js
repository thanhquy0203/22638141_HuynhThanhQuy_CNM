const service = require("../services/categoryService");

exports.list = async (req, res) => {
  const categories = await service.listAll();
  res.render("categories/list", { categories });
};

exports.getAdd = (req, res) => {
  res.render("categories/add-edit", { title: "Add Category", category: null });
};

exports.postAdd = async (req, res) => {
  await service.create(req.body);
  req.flash("success", "Thêm category thành công!");
  res.redirect("/categories");
};

exports.getEdit = async (req, res) => {
  const category = await service.getById(req.params.id);
  if (!category) return res.redirect("/categories");
  res.render("categories/add-edit", { title: "Edit Category", category });
};

exports.postEdit = async (req, res) => {
  await service.update(req.params.id, req.body);
  req.flash("success", "Cập nhật category thành công!");
  res.redirect("/categories");
};

exports.postDelete = async (req, res) => {
  // business rule: xoá category không xoá sản phẩm
  await service.remove(req.params.id);
  req.flash("success", "Đã xoá category!");
  res.redirect("/categories");
};
