const router = require("express").Router();
const authController = require("../controllers/authController");
const { seedAdmin } = require("../services/authService");

seedAdmin().catch(console.error);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

module.exports = router;
