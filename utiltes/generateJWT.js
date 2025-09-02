const jwt = require('jsonwebtoken');

module.exports = async (information) => {
 const token =await jwt.sign(
    information,
    process.env.JWT_SECRET_KEY)
    return token;
}