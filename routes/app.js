 const express = require('express')
const app = express.Router()

require('./routes/user')(app)
require('./routes/post')(app)
require('./routes/tag')(app)
// require('./routes/comment')(app)

// Middleware to handle default routes
app.use((req, res, next) => {
    if (req.originalUrl === '/' || req.originalUrl === '/favicon.ico') {
      return res.status(204).end(); // Return a non-content response
    }
    next(); // Continue to the next middleware
  });

module.exports = app  