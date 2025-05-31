/**
 * Calculates discounts for cart items
 * Applies a 10% discount if products from different categories are present AND coupon is applied
 * @param {Array} items - Array of cart items
 * @param {Boolean} couponApplied - Whether the coupon has been applied
 * @returns {Object} - Discount information
 */
const calculateDiscount = (items, couponApplied = false) => {
  // If there are no items, no discount applies
  if (!items || items.length === 0) {
    return {
      discountEligible: false,
      discountApplied: false,
      discount: 0,
    };
  }

  // Get unique categories
  const categories = new Set(items.map((item) => item.category));

  // Check if eligible for discount (2 or more different categories)
  const discountEligible = categories.size >= 2;

  // Only apply discount if eligible AND coupon is applied
  if (discountEligible && couponApplied) {
    // Calculate total price before discount
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply 10% discount
    const discount = totalPrice * 0.1;

    return {
      discountEligible: true,
      discountApplied: true,
      discount: parseFloat(discount.toFixed(2)),
    };
  }

  return {
    discountEligible,
    discountApplied: false,
    discount: 0,
  };
};

module.exports = { calculateDiscount };
