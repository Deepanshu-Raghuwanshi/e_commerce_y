const Cart = require("../models/Cart");
const Order = require("../models/Order");

/**
 * Process checkout and create an order
 * @route POST /api/checkout
 * @access Private
 */
const checkout = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Create a new order from the cart
    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      discount: cart.discount,
      status: "pending",
    });

    // Save the order
    await order.save();

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    cart.totalItems = 0;
    cart.discount = 0;
    cart.discountApplied = false;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  checkout,
};
