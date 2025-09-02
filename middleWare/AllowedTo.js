const AppError = require("../utiltes/AppError");
const httbSatus = require('../utiltes/HttpHandle');

module.exports = (...roles) => {    
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = AppError.create(
        'this role is not authorized, please try again',
        404,
        httbSatus.FALIED
      );
      return next(error);
    }
    next();
  };
};
