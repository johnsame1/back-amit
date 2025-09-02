const express = require('express');
const router= express.Router()
const UserController = require('../controller/UserController');
const VerifyToken=require('../middleWare/verifyToken');
const AllowedTo=require('../middleWare/AllowedTo');
const UserRole = require('../utiltes/UserRole');

router.route('/')
.get(VerifyToken,AllowedTo(UserRole.Admin), UserController.GetAllUsers)

router.route('/:userId',)
.get(VerifyToken,UserController.GetById)

router.route('/register')
.post(UserController.register)

router.route('/updateUser/:userId',)
.patch(UserController.updateUser)

router.route('/login')
.post(UserController.login)

module.exports = router;
 