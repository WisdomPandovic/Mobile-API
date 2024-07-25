const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const userRoutes = require('./routes/routes/user'); 
const vehicleRoutes = require('./routes/routes/vehicle');

dotenv.config(); // Load environment variables from .env file

const app = express();

const PORT = process.env.PORT || 3007;
const DB_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mobile-app";

// Connect to MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('open', () => console.log("Database connected"));
mongoose.connection.on('error', (err) => console.log(err));

// Middleware
app.use(cors());
// app.use(morgan('combined'));
app.use('/postimage', express.static(path.join(__dirname, 'public', 'postimage')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use(routes);
app.use('/api/', userRoutes); // Prefix with '/users'
app.use('/api', vehicleRoutes);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});