const express = require("express");
const router = express.Router();
const { checkout } = require("../controllers/checkoutController");
const auth = require("../middleware/auth");

// Apply auth middleware to all checkout routes
router.use(auth);

// POST /api/checkout - Process checkout
router.post("/", checkout);

module.exports = router;
