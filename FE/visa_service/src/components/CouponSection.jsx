import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCouponToCart, removeCouponFromCart } from "../store/cartSlice";

const CouponSection = () => {
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const {
    discountEligible,
    couponApplied,
    couponCode: appliedCouponCode,
    loading,
    error,
    isOnline,
  } = useSelector((state) => state.cart);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    if (isOnline) {
      await dispatch(applyCouponToCart(couponCode.trim()));
    }
    setCouponCode("");
    setShowCouponInput(false);
  };

  const handleRemoveCoupon = async () => {
    if (isOnline) {
      await dispatch(removeCouponFromCart());
    }
  };

  // Don't show anything if not eligible for discount
  if (!discountEligible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
      {!couponApplied ? (
        <div>
          <div className="flex items-center mb-3">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                🎉 Special Offer Available!
              </h3>
              <p className="text-sm text-green-700">
                You have items from multiple categories. Apply a coupon to get
                10% off!
              </p>
            </div>
          </div>

          {!showCouponInput ? (
            <button
              onClick={() => setShowCouponInput(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
              disabled={loading || !isOnline}
            >
              Apply Coupon Code
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code (e.g., SAVE10)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={loading || !couponCode.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
              >
                {loading ? "Applying..." : "Apply"}
              </button>
              <button
                onClick={() => {
                  setShowCouponInput(false);
                  setCouponCode("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}

          <div className="mt-3 text-xs text-gray-600">
            <p>
              💡 Try these codes:{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">SAVE10</span>
              ,{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">
                DISCOUNT10
              </span>
              ,{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">
                BUNDLE10
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  ✅ Coupon Applied!
                </h3>
                <p className="text-sm text-green-700">
                  Coupon{" "}
                  <span className="font-mono bg-green-100 px-1 rounded">
                    {appliedCouponCode}
                  </span>{" "}
                  is active. You're saving 10%!
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-800 text-sm underline"
              disabled={loading || !isOnline}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {!isOnline && (
        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
          You're offline. Coupon features require an internet connection.
        </div>
      )}
    </div>
  );
};

export default CouponSection;
