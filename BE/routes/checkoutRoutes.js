const express = require("express");
const router = express.Router();
const {
  checkout,
  getUserOrders,
  getOrderById,
} = require("../controllers/checkoutController");
const auth = require("../middleware/auth");

// Apply auth middleware to all checkout routes
router.use(auth);

// POST /api/checkout - Process checkout
router.post("/", checkout);

// GET /api/checkout/orders - Get all orders for the current user
router.get("/orders", getUserOrders);

// GET /api/checkout/orders/:id - Get a specific order by ID
router.get("/orders/:id", getOrderById);

module.exports = router;
