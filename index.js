const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
console.log('port.env:', process.env.PORT);
console.log('process', process.env.MongoDB_URL);

app.use(cors());
app.use(express.json());

const url = process.env.MongoDB_URL;
mongoose.connect(url).then(() => {
  console.log('mongoDB connected');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const UsersRoutes = require('./routes/UserRoutes.js');
const httpStatus = require('./utiltes/HttpHandle.js'); 
const MenuRoutes = require('./routes/MenuRoutes.js');
const BlogRoutes = require('./routes/Blogs.js');
const TableRoutes = require('./routes/TableRoutes.js');
const DashboardRoutes = require('./routes/Dashboard.js');

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

app.use('/api/Users', UsersRoutes);
app.use('/api/Menu', MenuRoutes);
app.use('/api/Table', TableRoutes);
app.use('/api/Blog', BlogRoutes);
app.use('/api/dashboard', DashboardRoutes);

app.all('/*', (req, res, next) => {
  return res
    .status(404)
    .json({ status: httpStatus.ERROR, data: { Message: 'url not found' } });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatus.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT, () => {
  console.log('listening on  port 8000');
});
