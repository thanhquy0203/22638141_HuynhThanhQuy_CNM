const router = require("express").Router();
const productController = require("../controllers/productController");
const { requireLogin, requireAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", requireLogin, productController.list);

router.get("/add", requireAdmin, productController.getAdd);
router.post("/add", requireAdmin, upload.single("image"), productController.postAdd);

router.get("/:id/edit", requireAdmin, productController.getEdit);
router.post("/:id/edit", requireAdmin, upload.single("image"), productController.postEdit);

router.post("/:id/delete", requireAdmin, productController.postDelete);

module.exports = router;
