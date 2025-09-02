const Table = require('../model/TableModel');
const AssyncWrapper = require('../middleWare/AssyncWrapper');
const httpStatus = require('../utiltes/HttpHandle');
const AppError = require('../utiltes/AppError');

const Get_All_Table = AssyncWrapper(async (req, res, next) => {
  const { status } = req.query;

  let query = {};
  if (status === "Accepted") {
    query.status = "Accepted";
  }
  if (status === "Rejected") {
    query.status = "Rejected";
  }
  if (status === "Pending") {
    query.status = "Pending";
  }

  const tables = await Table.find(query);

  res.json({
    status: httpStatus.SUCCESS,
    length: tables.length,
    data: { tables }
  });
});

const Get_Table_BY_Id = AssyncWrapper(async (req, res, next) => {
  const table = await Table.findById(req.params.tableId);
  if (!table) {
    const error = AppError.create(
      'Table not found please try again',
      404,
      httpStatus.ERROR
    );
    return next(error);
  }
  res.json({ status: httpStatus.SUCCESS, data: { table } });
});
const Book_A_Table = AssyncWrapper(async (req, res, next) => {
  const {
    Number_Of_Persons,
    Number_Of_Table,
    Booking_Date,
    UserId,
    Booking_Time,
    Phone_Number,
    Name,
  } = req.body;

  if (!Number_Of_Table) {
    const error = AppError.create(
      'Number_Of_Table is required',
      404,
      httpStatus.ERROR
    );
    return next(error);
  }
  if (!Booking_Time) {
    const error = AppError.create(
      ' Booking_Time is required',
      404,
      httpStatus.ERROR
    );
    return next(error);
  }
  if (!Name) {
    const error = AppError.create(' Name is required', 404, httpStatus.ERROR);
    return next(error);
  }

  if (!Number_Of_Persons) {
    const error = AppError.create(
      'Number_Of_Persons is required',
      404,
      httpStatus.ERROR
    );
    return next(error);
  }

  if (!Booking_Date) {
    const error = AppError.create(
      'Booking_Date is required',
      404,
      httpStatus.ERROR
    );
    return next(error);
  }

  if (!UserId) {
    const error = AppError.create(
      'Booking_Date is required',
      404,
      httpStatus.ERROR
    );
    return next(error);
  }
  if (!Phone_Number) {
    const error = AppError.create(
      'Phone_Number is required',
      404,
      httpStatus.ERROR
    );
    return next(error);
  }

  // Check if the table is already booked for the same date and time
  const existingBooking = await Table.findOne({
    Booking_Date,
    Booking_Time,
    Number_Of_Table,
  });

  if (existingBooking) {
    const error = AppError.create(
      'This table is already booked for the selected time and date',
      400,
      httpStatus.ERROR
    );
    return next(error);
  }

  const newTable = new Table({
    Number_Of_Persons,
    Number_Of_Table,
    Booking_Date,
    UserId,
    Booking_Time,
    Phone_Number,
    Name,
  });
  
  await newTable.save();
  res.json({ status: httpStatus.SUCCESS, data: { newTable } });
});

const UserBooking = AssyncWrapper(async (req, res, next) => {
  const ID = req.params.userId;
  const bookings = await Table.find({ UserId: ID });

  if (!bookings) {
    const error = AppError.create(
      'you Dont Have Booking',
      404,
      httpStatus.ERROR
    )
    return next(error);
  } else {
res.json({ status: httpStatus.SUCCESS, data: bookings });
  }
});
const UpdateStatus = AssyncWrapper(async (req, res, next) => {
  const tableId = req.params.tableId;
  const updatedSatus = await Table.updateOne(
    { _id: tableId },
    { $set: { ...req.body } }
  );
  return res.json({
    status: httpStatus.SUCCESS,
    data: { table: updatedSatus },
  });
});

module.exports = {
  Get_All_Table,
  Get_Table_BY_Id,
  Book_A_Table,
  UserBooking,
  UpdateStatus,
};
