const express = require("express");
const router = express.Router();

const PostController = require("../controller/PostController");

router.post("/", PostController.create_post);
router.get("/timeline", PostController.get_timeline);

router.put("/:id", PostController.update_post);
router.delete("/:id", PostController.delete_post);
router.get("/:id", PostController.get_single_post);

router.put("/:id/like_dislike_post", PostController.like_dislike_post);

module.exports = router;
