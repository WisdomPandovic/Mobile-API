// // for local
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require("cors");
// const app = express()
// const path = require('path')

// const PORT = process.env.PORT || 3007;
// // const DB_URL = "mongodb://127.0.0.1:27017/imgur-blog"
// const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/imgur-blog";
// const routes = require('./routes/app')

// mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology:true})
// mongoose.connection.on('open',()=>console.log("Server connected"))
// mongoose.connection.on('err',(err)=>console.log(err))

// app.use(cors());
// app.use('/postimage', express.static(path.join(__dirname,'public',"postimage")))
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// app.use(routes)

// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`App is running on http://0.0.0.0:${PORT}`);
//   });
  

// for production

// Load environment variables from .env file if available
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

// Use environment variables for configuration
const PORT = process.env.PORT || 3007;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/imgur-blog";
const routes = require('./routes/app');

// Connect to MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('open', () => console.log("Server connected"));
mongoose.connection.on('error', (err) => console.log(err));

// Configure session management using connect-mongo
app.use(session({
    secret: 'your-secret-key',  // Replace with a secure key in production
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: DB_URL,
        collectionName: 'sessions'
    })
}));

app.use(cors());
app.use('/postimage', express.static(path.join(__dirname, 'public', 'postimage')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is running on http://0.0.0.0:${PORT}`);
});
