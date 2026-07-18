const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if(! tokenCookieValue) {
            return next();
            
        }

        try{
            const userpayload = validateToken(tokenCookieValue);
            req.user = userpayload;
            return next();
        }catch (error){
            return res.redirect("/user/signin");
        }
    }
}

module.exports = {
    checkForAuthenticationCookie,
}