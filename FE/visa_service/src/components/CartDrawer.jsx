import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCartItems,
} from "../store/cartSlice";
import { createCheckout } from "../store/checkoutSlice";
import { useState } from "react";
import CouponSection from "./CouponSection";

const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
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
  } = useSelector((state) => state.cart);

  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    showForm: false,
  });

  const handleRemoveItem = (id) => {
    if (isOnline) {
      dispatch(removeItemFromCart(id));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return; // Don't allow quantity less than 1

    if (isOnline) {
      console.log("Updating item quantity:", id, quantity);
      dispatch(updateCartItemQuantity({ productId: id, quantity }));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (onCheckout) {
      // If onCheckout prop is provided, use it to navigate to checkout page
      onCheckout();
    } else if (isOnline) {
      // If online, show customer info form
      setCustomerInfo((prev) => ({ ...prev, showForm: true }));
    } else {
      // If offline, use local checkout flow
      setIsCheckoutComplete(true);
      setTimeout(() => {
        dispatch(clearCart());
        setIsCheckoutComplete(false);
        onClose();
      }, 3000);
    }
  };

  const handleSubmitCheckout = (e) => {
    e.preventDefault();

    // Create checkout session with API
    dispatch(
      createCheckout({
        cartId: "current", // This would be the actual cart ID in a real app
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        },
      })
    );

    // Reset form and show success
    setCustomerInfo({ name: "", email: "", phone: "", showForm: false });
    setIsCheckoutComplete(true);

    // Clear cart after delay
    setTimeout(() => {
      if (isOnline) {
        dispatch(clearCartItems());
      } else {
        dispatch(clearCart());
      }
      setIsCheckoutComplete(false);
      onClose();
    }, 3000);
  };

  const handleCancelCheckout = () => {
    setCustomerInfo((prev) => ({ ...prev, showForm: false }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={customerInfo.showForm ? null : onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          {!customerInfo.showForm && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isCheckoutComplete ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-green-500 mb-4"
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
              <h3 className="text-xl font-semibold text-green-600">
                Order Placed Successfully!
              </h3>
              <p className="text-gray-600 mt-2">Thank you for your purchase.</p>
            </div>
          ) : customerInfo.showForm ? (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-4">
                Customer Information
              </h3>
              <form onSubmit={handleSubmitCheckout}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="pt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelCheckout}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition flex justify-center items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        "Complete Order"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2"
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
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  {item.image && (
                    <div className="w-16 h-16 mr-3 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-blue-600 font-medium">
                      $
                      {typeof item.price === "number"
                        ? item.price.toFixed(2)
                        : "0.00"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-md"
                      disabled={item.quantity <= 1 || loading}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-md"
                      disabled={loading}
                    >
                      +
                    </button>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && !isCheckoutComplete && !customerInfo.showForm && (
          <div className="border-t p-4 space-y-4">
            {/* Coupon Section */}
            <CouponSection />

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>
                  ${typeof subtotal === "number" ? subtotal.toFixed(2) : "0.00"}
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

              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>
                  $
                  {typeof totalAmount === "number"
                    ? totalAmount.toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 rounded-md transition flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                "Checkout"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
