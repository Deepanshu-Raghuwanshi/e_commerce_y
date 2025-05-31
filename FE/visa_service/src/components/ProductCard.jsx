import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, addItemToCart } from "../store/cartSlice";
import Toast from "./Toast";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isOnline } = useSelector((state) => state.cart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      if (isOnline) {
        // Use API if online
        const result = await dispatch(
          addItemToCart({
            productId: product.id,
            quantity: 1,
          })
        ).unwrap();

        // Check if the operation was successful
        if (result.success) {
          // Show success message
          setShowSuccessToast(true);
        } else {
          throw new Error(result.message || "Failed to add item to cart");
        }
      } else {
        // Use local state if offline
        dispatch(addToCart(product));

        // Show success message
        setShowSuccessToast(true);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setErrorMessage(error.message || "Failed to add item to cart");
      setShowErrorToast(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Default image if none provided
  const productImage =
    product.image || "https://via.placeholder.com/150?text=Visa+Service";

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {product.image && (
          <div className="h-48 overflow-hidden">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {product.variant && (
            <div className="mt-1">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {product.variant}
              </span>
            </div>
          )}

          <p className="mt-2 text-gray-600 text-sm">{product.description}</p>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`${
                isAddingToCart
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded-md text-sm transition flex items-center`}
            >
              {isAddingToCart ? (
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
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <Toast
          message={`${product.name} added to cart!`}
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <Toast
          message={errorMessage}
          type="error"
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
