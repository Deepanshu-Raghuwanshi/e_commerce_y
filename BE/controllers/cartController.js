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
    const { discountEligible, discountApplied, discount } = calculateDiscount(
      cart.items,
      cart.couponApplied
    );
    cart.discountEligible = discountEligible;
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

    // Find the index of the item with matching product ID
    let itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === itemId
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
    const { discountEligible, discountApplied, discount } = calculateDiscount(
      cart.items,
      cart.couponApplied
    );
    cart.discountEligible = discountEligible;
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

/**
 * Update item quantity in cart
 * @route PUT /api/cart
 * @access Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Find the cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the item in the cart by product ID
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;

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
    const { discountEligible, discountApplied, discount } = calculateDiscount(
      cart.items,
      cart.couponApplied
    );
    cart.discountEligible = discountEligible;
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
      message: "Cart item updated",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Clear user's cart
 * @route DELETE /api/cart/clear
 * @access Private
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Clear all items
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    cart.discount = 0;
    cart.discountApplied = false;
    cart.couponCode = null;
    cart.couponApplied = false;
    cart.discountEligible = false;

    // Save the cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Apply coupon to cart
 * @route POST /api/cart/coupon
 * @access Private
 */
const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.userId;

    // Validate input
    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    // For now, we'll accept "SAVE10" as the valid coupon code
    // In a real application, you would validate against a coupons database
    const validCoupons = ["SAVE10", "DISCOUNT10", "BUNDLE10"];

    if (!validCoupons.includes(couponCode.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Find the cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check if cart has items
    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot apply coupon to empty cart",
      });
    }

    // Check if coupon is already applied
    if (cart.couponApplied) {
      return res.status(400).json({
        success: false,
        message: "A coupon is already applied to this cart",
      });
    }

    // Apply the coupon
    cart.couponCode = couponCode.toUpperCase();
    cart.couponApplied = true;

    // Recalculate totals with coupon applied
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Apply discount if applicable
    const { discountEligible, discountApplied, discount } = calculateDiscount(
      cart.items,
      cart.couponApplied
    );
    cart.discountEligible = discountEligible;
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
      message: discountApplied
        ? "Coupon applied successfully! You saved 10%"
        : "Coupon applied, but discount requires items from 2+ different categories",
      data: cart,
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Remove coupon from cart
 * @route DELETE /api/cart/coupon
 * @access Private
 */
const removeCoupon = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check if coupon is applied
    if (!cart.couponApplied) {
      return res.status(400).json({
        success: false,
        message: "No coupon applied to this cart",
      });
    }

    // Remove the coupon
    cart.couponCode = null;
    cart.couponApplied = false;

    // Recalculate totals without coupon
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Apply discount if applicable (should be false now)
    const { discountEligible, discountApplied, discount } = calculateDiscount(
      cart.items,
      cart.couponApplied
    );
    cart.discountEligible = discountEligible;
    cart.discountApplied = discountApplied;
    cart.discount = discount;

    // Save the cart
    await cart.save();

    // Populate product details for response
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error removing coupon:", error);
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
  updateCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
};
