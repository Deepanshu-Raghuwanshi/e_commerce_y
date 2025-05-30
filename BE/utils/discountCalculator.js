/**
 * Calculates discounts for cart items
 * Applies a 10% discount if products from different categories are present
 * @param {Array} items - Array of cart items
 * @returns {Object} - Discount information
 */
const calculateDiscount = (items) => {
  // If there are no items or only one item, no discount applies
  if (!items || items.length <= 1) {
    return {
      discountApplied: false,
      discount: 0,
    };
  }

  // Get unique categories
  const categories = new Set(items.map((item) => item.category));

  // If there are products from different categories, apply 10% discount
  if (categories.size > 1) {
    // Calculate total price before discount
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply 10% discount
    const discount = totalPrice * 0.1;

    return {
      discountApplied: true,
      discount: parseFloat(discount.toFixed(2)),
    };
  }

  return {
    discountApplied: false,
    discount: 0,
  };
};

module.exports = { calculateDiscount };
