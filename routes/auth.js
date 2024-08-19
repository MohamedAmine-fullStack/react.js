const express = require("express");
const router = express.Router();

// Routes

router.get("", (req, res) => {
  res.redirect("/user/login");
});
router.get("/user/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});
router.get("/user/register", (req, res) => {
  res.render("auth/register", { title: "register" });
});
module.exports = router;
