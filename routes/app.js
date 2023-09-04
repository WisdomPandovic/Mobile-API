 const express = require('express')
const app = express.Router()

require('./routes/user')(app)
require('./routes/post')(app)
require('./routes/tag')(app)
// require('./routes/comment')(app)

module.exports = app  