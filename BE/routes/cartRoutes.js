const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");
const auth = require("../middleware/auth");

// Apply auth middleware to all cart routes
router.use(auth);

// GET /api/cart - Get the current user's cart
router.get("/", getCart);

// POST /api/cart - Add a product to the cart
router.post("/", addToCart);

// DELETE /api/cart/:itemId - Remove an item from the cart
router.delete("/:itemId", removeFromCart);

module.exports = router;
