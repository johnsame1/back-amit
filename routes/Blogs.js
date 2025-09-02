const express = require('express');
const router = express.Router();
const AllowedTo = require('../middleWare/AllowedTo');
const BlogRoutes = require('../controller/BlogsController');
const UserRole = require('../utiltes/UserRole');
const VerifyToken = require('../middleWare/verifyToken');
const photoUpload = require('../middleWare/photoUpload');

router
  .route('/')
  .get(BlogRoutes.GetAllBlog)
  .post(
    VerifyToken,
    AllowedTo(UserRole.Admin),
    photoUpload.single('image'),
    BlogRoutes.addBlog
  );

router
  .route('/:blogId')
  .get(
    BlogRoutes.GetById
  )
  .patch(
    VerifyToken,
    AllowedTo(UserRole.Admin),
    photoUpload.single('image'),
    BlogRoutes.updateBlog
  )
  .delete(VerifyToken, AllowedTo(UserRole.Admin), BlogRoutes.deleteBlog);
module.exports = router;
