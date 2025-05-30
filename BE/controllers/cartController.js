const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { calculateDiscount } = require("../utils/discountCalculator");

/**
 * Get cart for the current user
 * @route GET /api/cart
 * @access Private
 */
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    // Find cart for the user or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Add item to cart
 * @route POST /api/cart
 * @access Private
 */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.userId;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is in stock
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists in cart, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        name: product.name,
        category: product.category,
      });
    }

    // Calculate total price and items
    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Apply discount if applicable
    const { discountApplied, discount } = calculateDiscount(cart.items);
    cart.discountApplied = discountApplied;
    cart.discount = discount;

    // If discount applied, update total price
    if (discountApplied) {
      cart.totalPrice -= discount;
    }

    // Save the cart
    await cart.save();

    // Populate product details for response
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Remove item from cart
 * @route DELETE /api/cart/:itemId
 * @access Private
 */
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.userId;

    // Find the cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Recalculate total price and items
    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Apply discount if applicable
    const { discountApplied, discount } = calculateDiscount(cart.items);
    cart.discountApplied = discountApplied;
    cart.discount = discount;

    // If discount applied, update total price
    if (discountApplied) {
      cart.totalPrice -= discount;
    }

    // Save the cart
    await cart.save();

    // Populate product details for response
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
