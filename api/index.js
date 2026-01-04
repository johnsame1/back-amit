const serverless = require('serverless-http');
const app = require('../index.js'); // المسار للـ index.js
module.exports = serverless(app);
