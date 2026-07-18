const { Router } = require("express");
const User = require("../models/user");

const router = Router();


router.get("/logout", (req, res) => {
    res.clearCookie("Token");
    return res.redirect("signin");
});

router.get("/signin", (req, res)=>{
    return res.render('signin',{ user: req.user });
});

router.get("/signup", (req, res)=>{
    return res.render('signup',{ user: req.user });
});

router.post("/signin", async(req, res) => {
    const { email, password } = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log("Token: ",token);
        return res.cookie("Token", token).redirect("/");
    } catch(error){
        return res.render("signin", {
            user: req.user,
            error: "Incorrect Email or Password!!",
        });
    }
});

router.post('/signup', async (req, res)=>{
    const { fullname, email, password } = req.body;

    try {
        await User.create({
            fullname,
            email,
            password,
        });
        return res.redirect("/");
    } catch (error) {
        // Mongo duplicate-key error (unique email index already exists)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.render("signup", {
                user: req.user,
                error: "An account with this email already exists. Please sign in instead.",
                fullname,
                email,
            });
        }

        // Mongoose validation errors (e.g. missing/invalid fields)
        if (error.name === "ValidationError") {
            return res.render("signup", {
                user: req.user,
                error: "Please check your details and try again.",
                fullname,
                email,
            });
        }

        console.error("Signup error:", error);
        return res.render("signup", {
            user: req.user,
            error: "Something went wrong while creating your account. Please try again.",
            fullname,
            email,
        });
    }
});


module.exports = router;