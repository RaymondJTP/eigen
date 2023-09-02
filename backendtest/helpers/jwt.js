const jwt = require('jsonwebtoken');

function signToken(tokenPayLoad){
    return jwt.sign(tokenPayLoad, process.env.JWT_AUTH);
}

function verifyToken(access_token){
    return jwt.verify(access_token, process.env.JWT_AUTH);
}

module.exports = {
    signToken,
    verifyToken
}