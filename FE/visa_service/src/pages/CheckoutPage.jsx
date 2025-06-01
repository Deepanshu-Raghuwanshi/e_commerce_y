import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { processCheckout, resetCheckout } from "../store/checkoutSlice";
import { clearCart, clearCartItems } from "../store/cartSlice";
import { fetchProducts } from "../store/productSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items,
    subtotal,
    discountRate,
    discountAmount,
    totalAmount,
    isOnline,
  } = useSelector((state) => state.cart);
  const { loading, error, currentOrder, checkoutComplete } = useSelector(
    (state) => state.checkout
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0 && !checkoutComplete) {
      navigate("/");
    }
  }, [items, navigate, checkoutComplete]);

  // Reset checkout state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetCheckout());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(processCheckout());
  };

  // Effect to clear cart when checkout is complete
  useEffect(() => {
    if (checkoutComplete && items.length > 0) {
      const timer = setTimeout(() => {
        if (isOnline) {
          dispatch(clearCartItems());
        } else {
          dispatch(clearCart());
        }

        // Refresh product data to get updated quantities
        dispatch(fetchProducts());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [checkoutComplete, dispatch, isOnline, items.length]);

  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Success Animation */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <svg
                  className="w-12 h-12 text-green-600 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Order Confirmed! 🎉
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Thank you for your purchase! Your order has been placed
              successfully and we're preparing it for delivery.
            </p>
          </div>

          {currentOrder && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
                    <div className="space-y-1">
                      <p className="text-green-100">
                        Order ID:{" "}
                        <span className="font-mono font-semibold text-white">
                          {currentOrder._id}
                        </span>
                      </p>
                      <p className="text-green-100">
                        Date:{" "}
                        <span className="font-semibold text-white">
                          {new Date(currentOrder.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                      <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                      <span className="font-semibold capitalize">
                        {currentOrder.status || "Processing"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                  Items Ordered
                </h3>

                <div className="space-y-4">
                  {(currentOrder.items && currentOrder.items.length > 0
                    ? currentOrder.items
                    : items
                  ).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="bg-white px-2 py-1 rounded-md border mr-2">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-gray-500">
                            ${item.price?.toFixed(2)} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-700">
                    Total Amount:
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    $
                    {currentOrder.totalPrice &&
                    typeof currentOrder.totalPrice === "number"
                      ? currentOrder.totalPrice.toFixed(2)
                      : typeof totalAmount === "number"
                      ? totalAmount.toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5"
                ></path>
              </svg>
              Continue Shopping
            </button>

            <p className="text-sm text-gray-500 max-w-md mx-auto">
              You'll receive an email confirmation shortly with tracking
              information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">Complete your order details below</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Customer Information
                  </h2>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <p className="font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      Shipping Address
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="street"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Street Address *
                        </label>
                        <input
                          type="text"
                          id="street"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                            placeholder="New York"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            State/Province *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                            placeholder="NY"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="zipCode"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            ZIP/Postal Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                            placeholder="10001"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Country *
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                            placeholder="United States"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Processing Order...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          Place Order
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity} × ${item.price?.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-gray-800">
                          $
                          {typeof item.price === "number" &&
                          typeof item.quantity === "number"
                            ? (item.price * item.quantity).toFixed(2)
                            : "0.00"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>
                        $
                        {typeof subtotal === "number"
                          ? subtotal.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>

                    {discountRate > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Bundle Discount (10%)</span>
                        <span>
                          -$
                          {typeof discountAmount === "number"
                            ? discountAmount.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center font-bold text-lg pt-3 border-t">
                      <span className="text-gray-800">Total</span>
                      <span className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        $
                        {typeof totalAmount === "number"
                          ? totalAmount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
