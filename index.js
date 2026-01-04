const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// Middlewares
app.use(cors({ origin: "*" })); // مؤقت، للـ Frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
mongoose.connect(process.env.MongoDB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

// باقي Routes
const UsersRoutes = require('./routes/UserRoutes.js');
const MenuRoutes = require('./routes/MenuRoutes.js');
app.use('/api/Users', UsersRoutes);
app.use('/api/Menu', MenuRoutes);

// Error / 404 handler
app.all('/*', (req, res) => {
  res.status(404).json({ message: "URL not found" });
});
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});

// **مهم جدًا**: لو Localhost فقط
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log('Server running on port', PORT));
}

module.exports = app; // بدل listen → لـ Vercel
