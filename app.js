require("dotenv").config();

const express = require("express");
const path = require("path")
const mongoose = require("mongoose");
const cookie_parser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const { restrictToLoggedInOnly } = require("./middlewares/auth");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookie_parser());
app.use(checkForAuthenticationCookie("Token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

async function start() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected.");

    // Build/repair schema indexes (e.g. the unique email index) BEFORE
    // accepting any traffic. Without this, autoIndex runs in the background
    // after connect() resolves, so a signup landing right after a restart
    // can race the index build and slip a duplicate email past it.
    await mongoose.connection.syncIndexes();
    console.log("Indexes synced.");

    app.listen(PORT, () => console.log(`The port starts at PORT ${PORT}`));
}

start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});