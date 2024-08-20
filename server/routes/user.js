const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // Add this line to import mongoose

const Product = require("../models/Product");
const Cart = require("../models/Cart");
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

router.post("/shop/products/add-to-cart", isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.session.user._id;

  console.log("Received data:", { productId, quantity, userId });

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (cart) {
      // Check if the product already exists in the cart
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Update the quantity of the existing product
        cart.products[productIndex].quantity += parseInt(quantity);
      } else {
        // Add the new product to the cart
        cart.products.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity: parseInt(quantity),
        });
      }
    } else {
      // Create a new cart for the user
      cart = new Cart({
        userId: new mongoose.Types.ObjectId(userId),
        products: [
          {
            productId: new mongoose.Types.ObjectId(productId),
            quantity: parseInt(quantity),
          },
        ],
      });
    }

    // Save the cart
    await cart.save();

    res.redirect("/shop/products");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(500)
      .send({ success: false, message: "Error adding product to cart" });
  }
});
// -------------------------cart-------------------------
router.get("/shop/cart", isAuthenticated, async (req, res) => {
  try {
    const user = req.session.user;
    const cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      return res.render("user/cart", {
        user: user,
        title: "Cart",
        cartItems: [],
      });
    }

    const productIds = cart.products.map((p) => p.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = cart.products.map((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      );
      return {
        product: product,
        quantity: cartItem.quantity,
      };
    });

    res.render("user/cart", {
      user: user,
      title: "Cart",
      cartItems: cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Increment quantity
router.post("/cart/increment", isAuthenticated, async (req, res) => {
  const { productId } = req.body;
  const userId = req.session.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      const product = cart.products.find(
        (p) => p.productId.toString() === productId
      );
      if (product) {
        product.quantity += 1;
        await cart.save();
        return res.redirect("/shop/cart");
      }
    }
    // res
    //   .status(404)
    //   .json({ success: false, message: "Product not found in cart" });
  } catch (error) {
    console.error("Error incrementing quantity:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Decrement quantity
router.post("/cart/decrement", isAuthenticated, async (req, res) => {
  const { productId } = req.body;
  const userId = req.session.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      const product = cart.products.find(
        (p) => p.productId.toString() === productId
      );
      if (product && product.quantity > 1) {
        product.quantity -= 1;
        await cart.save();
        return res.redirect("/shop/cart");
      }
    }
    // res.status(404).json({
    //   success: false,
    //   message: "Product not found in cart or quantity is already 1",
    // });
  } catch (error) {
    console.error("Error decrementing quantity:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Remove from cart
router.post("/cart/remove", isAuthenticated, async (req, res) => {
  const { productId } = req.body;
  const userId = req.session.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = cart.products.filter(
        (p) => p.productId.toString() !== productId
      );
      await cart.save();
      return res.redirect("/shop/cart");
    }
    // res
    //   .status(404)
    //   .json({ success: false, message: "Product not found in cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
// -------------------------

router.get("/shop/checkout", isAuthenticated, async (req, res) => {
  try {
    const user = req.session.user;
    const cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      return res.render("user/cart", {
        user: user,
        title: "Cart",
        cartItems: [],
      });
    }

    const productIds = cart.products.map((p) => p.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = cart.products.map((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      );
      return {
        product: product,
        quantity: cartItem.quantity,
      };
    });

    res.render("user/checkout", {
      user: user,
      title: "Checkout",
      cartItems: cartItems,
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

router.post("/shop/cart/delete", isAuthenticated, async (req, res) => {
  const userId = req.session.user._id;

  try {
    const result = await Cart.deleteOne({ userId });
    if (result.deletedCount > 0) {
      res.redirect("/shop/products");
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
