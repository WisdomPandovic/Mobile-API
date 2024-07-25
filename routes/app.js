require('dotenv').config();

const express = require('express')
const app = express.Router()

require('./routes/user')(app)
require('./routes/post')(app)
require('./routes/vehicle')(app)
// require('./routes/proposal')(app)
// require('./routes/project')(app)
// require('./routes/payment')(app)
// require('./routes/message')(app)
// require('./routes/review')(app)

// Middleware to handle default routes
app.use((req, res, next) => {
    if (req.originalUrl === '/' || req.originalUrl === '/favicon.ico') {
      return res.status(204).end(); // Return a non-content response
    }
    next(); // Continue to the next middleware
  });

module.exports = app  