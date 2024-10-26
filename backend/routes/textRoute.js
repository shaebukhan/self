const express = require("express");
const { PostController, PostsController, UpdatePostController, DeletePostController } = require("../controllers/textController");
const router = express.Router();

const upload = require("../utils/upload");
router.post("/save-post", upload.single("image"), PostController);
router.post("/update-post", upload.single("image"), UpdatePostController);
router.get("/posts", PostsController);
router.post("/delete-post", upload.single("image"), DeletePostController);
module.exports = router;
