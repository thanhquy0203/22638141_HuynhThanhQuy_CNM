const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const { requireAdmin } = require("../middlewares/auth");

router.get("/", requireAdmin, categoryController.list);
router.get("/add", requireAdmin, categoryController.getAdd);
router.post("/add", requireAdmin, categoryController.postAdd);
router.get("/:id/edit", requireAdmin, categoryController.getEdit);
router.post("/:id/edit", requireAdmin, categoryController.postEdit);
router.post("/:id/delete", requireAdmin, categoryController.postDelete);

module.exports = router;
