const express = require('express');
const router= express.Router()
const BookTableController = require('../controller/BookTableController');
const VerifyToken=require('../middleWare/verifyToken');
const AllowedTo=require('../middleWare/AllowedTo');
const UserRole = require('../utiltes/UserRole');

router.route('/')
.get(VerifyToken,AllowedTo(UserRole.Admin),BookTableController.Get_All_Table)

router.route('/:tableId')
 .get(VerifyToken,AllowedTo(UserRole.Admin),BookTableController.Get_Table_BY_Id)

router.route('/bookTable')
 .post(VerifyToken,AllowedTo(UserRole.Admin,UserRole.User),BookTableController.Book_A_Table)

 
router.route('/TableId/:userId')
 .get(BookTableController.UserBooking)
 
router.route('/updateStatus/:tableId')
 .patch(VerifyToken,AllowedTo(UserRole.Admin),BookTableController.UpdateStatus)
 
 
 module.exports = router;
