const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.type === "user") {
    next();
  } else {
    res.redirect("/user/login");
  }
};

// Route for user dashboard
router.get("/shop/products", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    console.log(products);
    // Pass user data and products to the view
    res.render("user/products", {
      user: req.session.user,
      title: "User Dashboard",
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/shop/cart", isAuthenticated, async (req, res) => {
  try {
    // Fetch user's cart data from the database
    const user = req.session.user;
    // Render the cart view with user data
    res.render("user/cart", {
      user: user,
      title: "Cart",
    });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/shop/checkout", isAuthenticated, async (req, res) => {
  try {
    // Fetch user's cart data from the database
    const user = req.session.user;
    // Render the checkout view with user data
    res.render("user/checkout", {
      user: user,
      title: "Checkout",
    });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Route to handle user logout
router.get("/user/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/shop/products"); // Handle error
    }
    res.redirect("/user/login");
  });
});

module.exports = router;
