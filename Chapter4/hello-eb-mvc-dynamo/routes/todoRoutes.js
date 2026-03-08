const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

router.get("/", todoController.index);
router.post("/add", todoController.add);
router.post("/toggle", todoController.toggle);

module.exports = router;