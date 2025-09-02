// routes/DashboardRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../model/UserModel');
const Blog = require('../model/BlogModel');
const Menu = require('../model/MenuModel');

router.get('/stats', async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const blogsCount = await Blog.countDocuments();
    const menuCount = await Menu.countDocuments();

    // جلب جميع المستخدمين باسمهم والرول والإيميل
    const users = await User.find({}, 'name role email createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        usersCount,
        blogsCount,
        menusCount: menuCount,
        users, 
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: error.message,
    });
  }
});

module.exports = router;
