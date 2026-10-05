const { Router } = require("express");
const router = Router();
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

// use memory storage instead of disk storage
const storage = multer.memoryStorage();
const uploads = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap, adjust as needed
});

router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  return res.render("blog", { user: req.user, blog, comments });
});

router.post("/add-new", uploads.single("coverImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Cover image is required");
  }

  const user = req.user;
  if (!user) {
    return res.redirect("/user/signin");
  }

  const { body, title } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImage: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },
  });
  return res.redirect(`/`);
});

router.get("/:id/cover-image", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || !blog.coverImage || !blog.coverImage.data) {
    return res.status(404).send("Not found");
  }
  res.set("Content-Type", blog.coverImage.contentType);
  res.send(blog.coverImage.data);
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;