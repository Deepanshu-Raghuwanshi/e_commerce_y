const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} = require("../controllers/cartController");
const auth = require("../middleware/auth");

// Apply auth middleware to all cart routes
router.use(auth);

// GET /api/cart - Get the current user's cart
router.get("/", getCart);

// POST /api/cart - Add a product to the cart
router.post("/", addToCart);

// PUT /api/cart - Update item quantity in cart
router.put("/", updateCartItem);

// POST /api/cart/coupon - Apply coupon to cart
router.post("/coupon", applyCoupon);

// DELETE /api/cart/coupon - Remove coupon from cart
router.delete("/coupon", removeCoupon);

// DELETE /api/cart/clear - Clear the entire cart
router.delete("/clear", clearCart);

// DELETE /api/cart/:itemId - Remove an item from the cart
router.delete("/:itemId", removeFromCart);

module.exports = router;
