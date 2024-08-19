require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();
const port = 3000 || process.env.PORT;

app.use(express.static("public"));

// TEMPLATE ENGINE
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./routes/auth"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
