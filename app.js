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
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookie_parser());
app.use(checkForAuthenticationCookie("Token"));
app.use(express.static(path.join(__dirname, "public")));

let isConnected = false;
async function connectDB() {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL environment variable is missing.");
    }
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
}

// Ensure database connection for every request in serverless environment
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).send("Database connection error");
    }
});

app.get("/", async (req, res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.use((err, req, res, next) => {
    console.error("Application Error:", err);
    res.status(500).send(`Application Error: ${err.message}`);
});

if (require.main === module) {
    connectDB()
        .then(async () => {
            console.log("MongoDB Connected.");
            await mongoose.connection.syncIndexes();
            console.log("Indexes synced.");
            app.listen(PORT, () => console.log(`The port starts at PORT ${PORT}`));
        })
        .catch((error) => {
            console.error("Failed to start server:", error);
            process.exit(1);
        });
}

module.exports = app;