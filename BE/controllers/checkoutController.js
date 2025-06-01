const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * Process checkout and create an order
 * @route POST /api/checkout
 * @access Private
 */
const checkout = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Check if all products have sufficient quantity
    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} no longer exists`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${item.name}. Only ${product.quantity} available.`,
        });
      }
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

    // Update product quantities
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }

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

/**
 * Get all orders for the current user
 * @route GET /api/checkout/orders
 * @access Private
 */
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all orders for the user, sorted by creation date (newest first)
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Get a specific order by ID
 * @route GET /api/checkout/orders/:id
 * @access Private
 */
const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = req.params.id;

    // Find the specific order for the user
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  checkout,
  getUserOrders,
  getOrderById,
};
