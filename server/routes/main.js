const express = require("express");
const router = express.Router();
const User = require('../models/User');

router.get("/", (req, res) => {
  if (req.session.user) {
    if (req.session.user.type === 'admin') {
      res.redirect("/admin/dashboard"); // Redirect to admin dashboard
    } else if (req.session.user.type === 'user') {
      res.redirect("/user/dashboard"); // Redirect to user dashboard
    } else {
      res.redirect("/user/login"); // Redirect to login if type is not recognized
    }
  } else {
    res.redirect("/user/login"); // Redirect to login if not logged in
  }
});



module.exports = router;
