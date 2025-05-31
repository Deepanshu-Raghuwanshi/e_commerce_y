const Product = require("../models/Product");

/**
 * Get all products organized by categories
 * @route GET /api/products
 * @access Public
 */
const getProducts = async (req, res) => {
  try {
    // Get all products
    const products = await Product.find({});

    // Get all unique categories
    const categories = await Product.distinct("category");

    // Organize products by category
    const productsByCategory = {};

    // Initialize categories with empty arrays
    categories.forEach((category) => {
      productsByCategory[category] = [];
    });

    // Group products by their categories
    products.forEach((product) => {
      productsByCategory[product.category].push(product);
    });

    res.status(200).json({
      success: true,
      count: products.length,
      categories: categories,
      data: productsByCategory,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Get a single product by ID
 * @route GET /api/products/:id
 * @access Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
