const JWT = require("jsonwebtoken");

const secrete_key = "Indra Arrow";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
    };
    const token = JWT.sign(payload, secrete_key);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token, secrete_key);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}