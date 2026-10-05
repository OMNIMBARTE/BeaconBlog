// models/blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coverImage: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);