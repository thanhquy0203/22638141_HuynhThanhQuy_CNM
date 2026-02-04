const router = require("express").Router();
const logController = require("../controllers/logController");
const { requireAdmin } = require("../middlewares/auth");

router.get("/", requireAdmin, logController.list);

module.exports = router;
