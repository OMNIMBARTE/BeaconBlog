// models/blog.js
const mongoose = require("mongoose");
require("./user");

const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coverImage: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.models.blog || mongoose.model("Blog", blogSchema);
if (!mongoose.models.blog) {
  mongoose.model("blog", blogSchema);
}

module.exports = Blog;