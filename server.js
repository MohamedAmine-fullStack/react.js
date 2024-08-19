require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const connectDB = require("./server/config/db");

const app = express();
const port = 3000 || process.env.PORT;

connectDB();

app.use(express.static("public"));

// Middleware to parse JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TEMPLATE ENGINE
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Import routes
const mainRoutes = require("./server/routes/main");
const authRoutes = require("./server/routes/auth");

// Use routes
app.use(mainRoutes);
app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
