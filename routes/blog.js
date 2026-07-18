const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        console.log("file.originalname =>", file.originalname);
        console.log("file.mimetype =>", file.mimetype);

        let ext = path.extname(file.originalname);
        if (!ext && file.mimetype) {
            const mimeMap = {
                "image/png": ".png",
                "image/jpeg": ".jpg",
                "image/jpg": ".jpg",
                "image/gif": ".gif",
                "image/webp": ".webp",
            };
            ext = mimeMap[file.mimetype] || "";
        }

        cb(
            null,
            file.fieldname +
            "-" +
            uniqueSuffix +
            ext
        );
    }
})

const uploads = multer({storage: storage});

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});


router.get("/:id", async(req, res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    return res.render("blog",{
        user: req.user,
        blog,
        comments,
    });
});



router.post("/add-new",uploads.single('coverImage'), async(req, res) => {
    if (!req.file) {
        return res.status(400).send("Cover image is required");
    }
    console.log("USER =>", req.user);
    console.log("COOKIES =>", req.cookies);
    const user = req.user;
    if(! user){
        return res.redirect("/user/signin");
    }
    const { body, title } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/`);
});


router.post("/comment/:blogId", async(req, res)=>{
    
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});


module.exports = router;