const mongoose = require('mongoose');
const UserStatus = require('../utiltes/UserStatus');
const Book_A_TableSchema = new mongoose.Schema(
  {
    Number_Of_Persons: {
      type: Number,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Number_Of_Table: {
      type: Number,
      required: true,
    },
    Booking_Date: {
      type: Date,
      required: true,
    },
    UserId: {
      type: String,
      required: true,
    },
    Booking_Time: {
      type: String, 
      required: true,
    },
    Phone_Number: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [UserStatus.Pending, UserStatus.Accepted, UserStatus.Rejected],
      default: UserStatus.Pending,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('BookATableSchema', Book_A_TableSchema);
