const mongoose = require("mongoose");

// Define the cart schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

// Create and export the Cart model
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
