const express = require('express');
const router = express.Router();
const AllowedTo = require('../middleWare/AllowedTo');
const MenuRoutes = require('../controller/MenuController');
const UserRole = require('../utiltes/UserRole');
const VerifyToken = require('../middleWare/verifyToken');
const photoUpload = require('../middleWare/photoUpload');

router
  .route('/')
  .get(MenuRoutes.GetAllMenu)
  .post(
    VerifyToken,
    AllowedTo(UserRole.Admin),
    photoUpload.single('image'),
    MenuRoutes.addMenu
  );

router.route('/category').get(MenuRoutes.GetCategory);

router
  .route('/:menuId')
  .get(VerifyToken, AllowedTo(UserRole.Admin), MenuRoutes.GetById)
  .patch(
    VerifyToken,
    AllowedTo(UserRole.Admin),
    photoUpload.single('image'),
    MenuRoutes.updateMenu
  )
  .delete(VerifyToken, AllowedTo(UserRole.Admin), MenuRoutes.deleteMenu);

module.exports = router;
