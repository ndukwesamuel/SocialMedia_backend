const express = require("express");
const router = express.Router();

const userController = require("../controller/UserController");

router.put("/:id", userController.update_user);
router.delete("/:id", userController.delete_user);
router.get("/:id", userController.get_user);
//follow a user
router.put("/:id/follow", userController.follow_user);
router.put("/:id/Unfollow_user", userController.Unfollow_user);
router.put("/:id/Unfollow_user", userController.Unfollow_user);

module.exports = router;
