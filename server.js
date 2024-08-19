require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const connectDB = require("./server/config/db");
const session = require('express-session');

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
    res.locals.layout = 'layouts/authenticated'; // Layout for authenticated users
  } else {
    res.locals.layout = 'layouts/main'; // Layout for non-authenticated users
  }
  next();
});


// Import routes
const mainRoutes = require("./server/routes/main");
const authRoutes = require("./server/routes/auth");

// Use routes
app.use(mainRoutes);
app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
