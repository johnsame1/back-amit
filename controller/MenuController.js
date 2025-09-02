const Menu = require('../model/MenuModel');
const AssyncWrapper = require('../middleWare/AssyncWrapper');
const httpStatus = require('../utiltes/HttpHandle');
const AppError = require('../utiltes/AppError');
const { findOne, $where } = require('../model/UserModel');
const path = require('path');
const fs = require('fs');
const { cloudinaryRemoveImage, cloudinaryUploadImage } = require('../utiltes/cloudinary');

const GetAllMenu = AssyncWrapper(async (req, res, next) => {
  const menu = await Menu.find({});

  res.json({ status: httpStatus.SUCCESS, data: menu });
});

const GetCategory = AssyncWrapper(async (req, res, next) => {
  const categories = await Menu.distinct('category');
  res.json({ status: httpStatus.SUCCESS, data: categories });
});

const GetById = AssyncWrapper(async (req, res, next) => {
  const menu = await Menu.findById(req.params.menuId);
  if (!menu) {
    const error = AppError.create('element not found', 404, httpStatus.ERROR);
    return next(error);
  }
  return res.json({ status: httpStatus.SUCCESS, data: { menu } });
});

const addMenu = AssyncWrapper(async (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category || !req.file) {
    const error = AppError.create(
      'Please provide name, description, image , price, and category',
      400,
      httpStatus.ERROR
    );
    return next(error);
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  console.log('🟩 result: ', result)
  
  const newMenu = new Menu({
    name,
    description,
    price,
    category,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  await newMenu.save();

  res.json({
    status: httpStatus.SUCCESS,
    message: 'Menu item added successfully',
    data: newMenu,
  });
  fs.unlinkSync(imagePath);
});

const updateMenu = AssyncWrapper(async (req, res, next) => {
  const menuId = req.params.menuId;

  let updateData = { ...req.body };

  if (req.file) {
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    const oldMenu = await Menu.findById(menuId);
    if (!oldMenu) {
      return next(AppError.create('menu item not found', 404, httpStatus.ERROR));
    }

    await cloudinaryRemoveImage(oldMenu.image.publicId);

    updateData.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    fs.unlinkSync(imagePath);
  }

  const updatedMenu = await Menu.findByIdAndUpdate(menuId, updateData, { new: true });

  if (!updatedMenu) {
    return next(AppError.create('menu item not found after update', 404, httpStatus.ERROR));
  }

  return res.json({ status: httpStatus.SUCCESS, data: { menu: updatedMenu } });
});

const deleteMenu = AssyncWrapper(async (req, res, next) => {
  let menuId = req.params.menuId;
  await Menu.findByIdAndDelete(menuId);
  return res.json({
    status: httpStatus.SUCCESS,
    data: 'the_data_has_been_deleted',
  });
});

module.exports = {
  GetAllMenu,
  GetById,
  addMenu,
  updateMenu,
  deleteMenu,
  GetCategory,
};
