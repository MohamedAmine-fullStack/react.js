const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/user/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).lean().exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid email/password",
      });
    }
    // Set session data
    req.session.user = user;
    return res.redirect("/");
  } catch (error) {
    return res.render("auth/login", {
      title: "Login",
      error: "Something went wrong",
    });
  }
});


router.get("/user/register", (req, res) => {
  res.render("auth/register", { title: "register" });
});

router.post("/user/register", async (req, res) => {
  const { username, email, password } = req.body;
  const type = "user"; // Set type to 'user' here

  if (!username || !email || !password || !type) {
    return res.render("auth/register", {
      title: "register",
      error: "All fields are required",
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      type,
    });
    return res.redirect("/user/login");
  } catch (error) {
    return res.render("auth/register", {
      title: "register",
      error: "Something went wrong",
    });
  }
});

router.get("/user/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/dashboard'); // Handle error
    }
    res.redirect('/user/login');
  });
});


module.exports = router;
