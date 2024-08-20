require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const connectDB = require("./server/config/db");
const session = require('express-session');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.static("public"));

app.use(session({
  secret: 'this_is_my_secret_key', // Use a more secure key in production
  resave: false,
  saveUninitialized: true
}));

// Middleware to parse JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TEMPLATE ENGINE
app.use(expressLayouts);
app.set("view engine", "ejs");

// Middleware to set the layout based on authentication
app.use((req, res, next) => {
  if (req.session.user) {
    if (req.session.user.type === 'admin') {
      res.locals.layout = 'layouts/admin';
    } else if (req.session.user.type === 'user') {
      res.locals.layout = 'layouts/user';
    } else {
      res.locals.layout = 'layouts/main'; // Default layout
    }
  } else {
    res.locals.layout = 'layouts/main'; // Default layout for non-authenticated users
  }
  next();
});


// Import routes
const mainRoutes = require("./server/routes/main");
const authRoutes = require("./server/routes/auth");
const userRoutes = require('./server/routes/user');
const adminRoutes = require('./server/routes/admin');

// Use routes
app.use(mainRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);
//app.use('/uploads', express.static('public/uploads'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
