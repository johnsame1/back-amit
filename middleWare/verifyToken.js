const jwt = require('jsonwebtoken');
const httpStatus = require('../utiltes/HttpHandle');
const AppError = require('../utiltes/AppError');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    const error = AppError.create("Token is required", 404, httpStatus.ERROR);
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodeToken; 
    next();
  } catch (err) {
    const error = AppError.create('Invalid token', 400, httpStatus.FALIED);
    return next(error);
  }
};

module.exports = verifyToken;
