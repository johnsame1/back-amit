const Blog = require('../model/BlogModel');
const AssyncWrapper = require('../middleWare/AssyncWrapper');
const httpStatus = require('../utiltes/HttpHandle');
const AppError = require('../utiltes/AppError');
const { findOne, $where } = require('../model/UserModel');
const path = require('path');
const fs = require('fs');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require('../utiltes/cloudinary');

const GetAllBlog = AssyncWrapper(async (req, res, next) => {
  const blog = await Blog.find({});
  const length = await Blog.countDocuments({});
  res.json({
    status: httpStatus.SUCCESS,
    length: length,
    data: length.blog,
    blog,
  });
});

const GetById = AssyncWrapper(async (req, res, next) => {
  const blog = await Blog.findById(req.params.blogId);
  if (!blog) {
    const error = AppError.create('element not found', 404, httpStatus.ERROR);
    return next(error);
  }
  return res.json({ status: httpStatus.SUCCESS, data: { blog } });
});

const addBlog = AssyncWrapper(async (req, res, next) => {
  if (!req.file) {
    const error = AppError.create('image is required', 400, httpStatus.ERROR);
    return next(error);
  }
  if (!req.body.description || !req.body.title) {
    const error = AppError.create(
      'Please provide description, title for each blog',
      400,
      httpStatus.ERROR
    );
    return next(error);
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  const newBlog = new Blog({
    description: req.body.description,
    title: req.body.title,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  await newBlog.save();

  res.json({
    status: httpStatus.SUCCESS,
    message: 'All blog items added successfully',
    data: newBlog,
  });
  fs.unlinkSync(imagePath);
});

const updateBlog = AssyncWrapper(async (req, res, next) => {
  const blogId = req.params.blogId;

  let updateData = { ...req.body };

  if (req.file) {
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return next(
        AppError.create('blog item not found', 404, httpStatus.ERROR)
      );
    }

    await cloudinaryRemoveImage(blog.image.publicId);

    updateData.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    fs.unlinkSync(imagePath);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
    new: true,
  });

  if (!updatedBlog) {
    return next(
      AppError.create('blog item not found after update', 404, httpStatus.ERROR)
    );
  }

  return res.json({ status: httpStatus.SUCCESS, data: { blog: updatedBlog } });
});

const deleteBlog = AssyncWrapper(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.blogId);
  if (!blog) {
    const error = AppError.create('Blog item not found', 404, httpStatus.ERROR);
    return next(error);
  }
  return res.json({
    status: httpStatus.SUCCESS,
    message: "The blog has been 'deleted' (simulated).",
  });
});

module.exports = {
  GetAllBlog,
  GetById,
  addBlog,
  updateBlog,
  deleteBlog,
};
