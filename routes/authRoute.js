const express = require("express");
const router = express.Router();

const AuthController = require("../controller/AuthController");

router.get("/register", AuthController.index_page___);
router.post("/register", AuthController.register_user);
router.post("/login", AuthController.login_user);

module.exports = router;
