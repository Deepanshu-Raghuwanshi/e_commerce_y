import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  removeItemFromCart,
  updateCartItemQuantity,
  fetchCart,
  clearCartError,
} from "../store/cartSlice";
import { fetchProducts } from "../store/productSlice";
import { showSuccessToast, showErrorToast } from "../store/toastSlice";
import CouponSection from "../components/CouponSection";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    items,
    subtotal,
    discountRate,
    discountAmount,
    totalAmount,
    discountEligible,
    couponApplied,
    loading,
    isOnline,
    error,
  } = useSelector((state) => state.cart);

  // Fetch cart when component mounts to ensure we have the latest data
  useEffect(() => {
    if (isOnline) {
      dispatch(fetchCart());
      // Also fetch products to ensure we have the latest quantities
      dispatch(fetchProducts());
    }
  }, [dispatch, isOnline]);

  // Clear any cart errors when component mounts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearCartError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRemoveItem = async (id) => {
    const item = items.find((item) => item.id === id);
    const itemName = item ? item.name : "Item";

    try {
      if (isOnline) {
        console.log("Removing item with ID:", id);
        await dispatch(removeItemFromCart(id)).unwrap();

        // Refresh product data to get updated quantities
        dispatch(fetchProducts());
      } else {
        dispatch(removeFromCart(id));
      }
      dispatch(showSuccessToast(`${itemName} removed from cart`));
    } catch (error) {
      dispatch(showErrorToast("Failed to remove item from cart"));
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return; // Don't allow quantity less than 1

    try {
      if (isOnline) {
        console.log("Updating item quantity:", id, quantity);
        await dispatch(
          updateCartItemQuantity({ productId: id, quantity })
        ).unwrap();

        // Refresh product data to get updated quantities
        dispatch(fetchProducts());
      } else {
        dispatch(updateQuantity({ id, quantity }));
      }
      // Only show toast for significant quantity changes (not every increment)
      if (quantity === 1) {
        dispatch(showSuccessToast("Quantity updated"));
      }
    } catch (error) {
      dispatch(showErrorToast("Failed to update quantity"));
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
            Your Cart
          </h1>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
                <button
                  onClick={() => dispatch(clearCartError())}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items Section */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
                  <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        {/* Mobile Layout */}
                        <div className="block sm:hidden">
                          <div className="flex items-start space-x-3 mb-3">
                            {item.image && (
                              <div className="w-16 h-16 flex-shrink-0">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {item.category}
                              </p>
                              <p className="text-blue-600 font-medium text-sm">
                                $
                                {typeof item.price === "number"
                                  ? item.price.toFixed(2)
                                  : "0.00"}
                              </p>
                            </div>
                          </div>

                          {/* Mobile Quantity Controls - Much smaller */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center bg-gray-50 rounded-md">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white rounded text-sm"
                                disabled={item.quantity <= 1 || loading}
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white rounded text-sm"
                                disabled={loading}
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                              disabled={loading}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center space-x-4">
                          {item.image && (
                            <div className="w-20 h-20 flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {item.category}
                            </p>
                            <p className="text-blue-600 font-medium">
                              $
                              {typeof item.price === "number"
                                ? item.price.toFixed(2)
                                : "0.00"}
                            </p>
                          </div>

                          {/* Desktop Quantity Controls - Smaller */}
                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <div className="flex items-center bg-gray-50 rounded-md">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white rounded text-sm"
                                disabled={item.quantity <= 1 || loading}
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white rounded text-sm"
                                disabled={loading}
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors"
                              disabled={loading}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1">
                {/* Coupon Section */}
                <CouponSection />

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 sticky top-4">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>
                        $
                        {typeof subtotal === "number"
                          ? subtotal.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>

                    {discountRate > 0 && couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount (10%):</span>
                        <span>
                          -$
                          {typeof discountAmount === "number"
                            ? discountAmount.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                    )}

                    {discountEligible && !couponApplied && (
                      <div className="flex justify-between text-blue-600 text-sm">
                        <span>Potential Savings:</span>
                        <span>Apply coupon for 10% off!</span>
                      </div>
                    )}

                    <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                      <span>Total:</span>
                      <span>
                        $
                        {typeof totalAmount === "number"
                          ? totalAmount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>

                  {/* Smaller checkout button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 text-sm rounded-md transition-all duration-300 flex justify-center items-center font-medium shadow-md hover:shadow-lg"
                    disabled={items.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </button>

                  {/* Smaller continue shopping button */}
                  <button
                    onClick={() => navigate("/")}
                    className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 text-sm rounded-md transition-all duration-300 font-medium border border-gray-200 hover:border-gray-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
