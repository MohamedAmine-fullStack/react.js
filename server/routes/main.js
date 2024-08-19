const express = require("express");
const router = express.Router();
const User = require('../models/User');


router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard"); // Redirect to dashboard if logged in
  } else {
    res.redirect("/user/login"); // Redirect to login if not logged in
  }
});

// In server/routes/main.js
router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/user/login'); // Redirect if not authenticated
  }

  res.render('dashboard', {
    title: 'Dashboard',
    user: req.session.user // Pass user data to the view
  });
});


module.exports = router;
