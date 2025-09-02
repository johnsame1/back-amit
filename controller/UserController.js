const User = require('../model/UserModel');
const AssyncWrapper = require('../middleWare/AssyncWrapper');
const httpStatus = require('../utiltes/HttpHandle');
const AppError = require('../utiltes/AppError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utiltes/generateJWT');

const GetAllUsers = AssyncWrapper(async (req, res) => {
  const users = await User.find();

  res.json({ status: httpStatus.SUCCESS, data: users });
});

const GetById = AssyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    const error = AppError.create('element not found', 404, httpStatus.ERROR);
    return next(error);
  }
  return res.json({ status: httpStatus.SUCCESS, data: { user } });
});

const register = AssyncWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name) {
    const error = AppError.create('name is required', 404, httpStatus.ERROR);
    return next(error);
  }

  if (!email) {
    const error = AppError.create('email is required', 404, httpStatus.ERROR);
    return next(error);
  }

  if (!password) {
    const error = AppError.create(
      'password is required',
      404,
      httpStatus.ERROR
    );
    return next(error);
  }

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = AppError.create(
      'user already exists',
      404,
      httpStatus.FALIED
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUsers = new User({
    name,
    email,
    role,
    password: hashedPassword,
  });
  const token = await generateToken({
    email: newUsers.email,
    id: newUsers._id,
    role: newUsers.role,
  });
  newUsers.token = token;

  await newUsers.save();
  res.json({
    status: httpStatus.SUCCESS,
    data: { newUsers, name: newUsers.name },
  });
});

const updateUser = AssyncWrapper(async (req, res, next) => {
  const userid = req.params.userId;
  const { password, email, ...rest } = req.body;

  const user = await User.findById(userid);
  if (!user) {
    const error = AppError.create('User not found', 404, httpStatus.ERROR);
    return next(error);
  }

  let updatedData = { ...rest };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedData.password = hashedPassword;
  }

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== userid) {
      const error = AppError.create(
        'Email already used by another user',
        400,
        httpStatus.FALIED
      );
      return next(error);
    }
    updatedData.email = email;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userid,
    { $set: updatedData },
    { new: true }
  );

  return res.json({
    status: httpStatus.SUCCESS,
    data: { message: 'User updated successfully', updatedUser },
  });
});

const login = AssyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    const error = AppError.create('email  is wrong', 404, httpStatus.ERROR);
    return next(error);
  }
  if (!password) {
    const error = AppError.create(' password is wrong', 404, httpStatus.ERROR);
    return next(error);
  }
  const user = await User.findOne({ email });

  if (!user) {
    const error = AppError.create('user not found', 404, httpStatus.ERROR);
    return next(error);
  }
  const MatchedPassword = await bcrypt.compare(password, user.password);

  if (user && MatchedPassword) {
    const token = await generateToken({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    res.json({
      status: httpStatus.SUCCESS,
      data: { name: user.name, iD: user._id, role: user.role, token },
    });
  } else {
    const error = AppError.create('password are wrong', 404, httpStatus.FALIED);
    return next(error);
  }
});

module.exports = {
  GetAllUsers,
  GetById,
  register,
  updateUser,
  login,
};
