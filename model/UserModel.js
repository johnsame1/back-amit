const mongoose = require('mongoose');
const validator = require('validator');
const UserRoles = require('../utiltes/UserRole');
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
      },
      email:{
        type:String,
        required:true,
        unique:true,
        validate: [validator.isEmail, 'falied must be a valid email']
      },
      password:{
        type:String,
        required:true
      },
      Subject:{
        type:String
      },
      Massege:{
        type:String
      },
    
      token:{
        type:String,
      },
      role:{
        type:String,
        enum:[UserRoles.User,UserRoles.Admin],
        default: UserRoles.User
      },
      createdAt:{
       type:Date,
        default: Date.now()
      },
      updatedAt:{
        type:Date,
        default: Date.now()
      }
    },
    {
      timestamps:true,
    })

module.exports = mongoose.model('User',UserSchema);