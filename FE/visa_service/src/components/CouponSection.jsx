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

  if (!discountEligible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-6 shadow-lg max-w-full overflow-hidden">
      {!couponApplied ? (
        <div className="w-full">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-2 mr-3 shadow-lg flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
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
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-green-800 mb-1">
                🎉 Special Offer Available!
              </h3>
              <p className="text-green-700 font-medium text-xs">
                You have items from multiple categories. Apply a coupon to get
                10% off!
              </p>
            </div>
          </div>

          {!showCouponInput ? (
            <div className="flex flex-col gap-1.5 w-full items-center">
              <button
                onClick={() => setShowCouponInput(true)}
                className="w-full sm:w-64 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 text-sm rounded-md transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                disabled={loading || !isOnline}
              >
                Apply Coupon Code
              </button>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              {/* Input field */}
              <div className="flex flex-col gap-1.5 w-full items-center">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code (e.g., SAVE10)"
                  className="w-full sm:w-64 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-2 text-sm rounded-md transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  disabled={loading}
                  onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                />
              </div>

              {/* Buttons - Stack vertically with smaller size */}
              <div className="flex flex-col gap-1.5 w-full items-center">
                <button
                  onClick={handleApplyCoupon}
                  disabled={loading || !couponCode.trim()}
                  className="w-full sm:w-64 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-3 py-2 text-sm rounded-md transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:transform-none"
                >
                  {loading ? "Applying..." : "Apply"}
                </button>
                <button
                  onClick={() => {
                    setShowCouponInput(false);
                    setCouponCode("");
                  }}
                  className="w-full sm:w-64 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-2 text-sm rounded-md transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-3 p-2 bg-white/70 rounded-md border border-green-200">
            <p className="text-xs text-gray-700 mb-1 font-medium">
              💡 Try these codes:
            </p>
            <div className="flex flex-wrap gap-1">
              {["SAVE10", "DISCOUNT10", "BUNDLE10"].map((code) => (
                <button
                  key={code}
                  onClick={() => setCouponCode(code)}
                  className="font-mono bg-white border border-gray-300 hover:border-green-400 px-2 py-0.5 rounded text-xs transition-all duration-200 hover:shadow-sm"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center flex-1 min-w-0">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-2 mr-3 shadow-lg flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
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
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-green-800 mb-1">
                  ✅ Coupon Applied!
                </h3>
                <p className="text-green-700 font-medium text-xs">
                  Coupon{" "}
                  <span className="font-mono bg-green-100 px-1 py-0.5 rounded border border-green-300 text-xs">
                    {appliedCouponCode}
                  </span>{" "}
                  is active. You're saving 10%!
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-800 text-xs underline font-medium transition-colors duration-200 flex-shrink-0 ml-2"
              disabled={loading || !isOnline}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-xs">
          {error}
        </div>
      )}

      {!isOnline && (
        <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-700 text-xs">
          You're offline. Coupon features require an internet connection.
        </div>
      )}
    </div>
  );
};

export default CouponSection;
