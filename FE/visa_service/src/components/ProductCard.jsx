import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addItemToCart } from "../store/cartSlice";
import { showSuccessToast, showErrorToast } from "../store/toastSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isOnline } = useSelector((state) => state.cart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      if (isOnline) {
        const result = await dispatch(
          addItemToCart({
            productId: product.id,
            quantity: 1,
            productDetails: product, // Pass the full product details
          })
        ).unwrap();

        if (result.success) {
          dispatch(showSuccessToast(`${product.name} added to cart!`));
        } else {
          throw new Error(result.message || "Failed to add item to cart");
        }
      } else {
        dispatch(addToCart(product));
        dispatch(showSuccessToast(`${product.name} added to cart!`));
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      dispatch(showErrorToast(error.message || "Failed to add item to cart"));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop";
  const productImage = imageError
    ? fallbackImage
    : product.image || fallbackImage;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div
        className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 sm:h-56 md:h-48 lg:h-56 overflow-hidden">
          <img
            src={productImage || "/placeholder.svg"}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            onError={handleImageError}
          />
          {/* Removed the black overlay that was causing the dark effect */}
          <div
            className={`absolute top-3 right-3 transform transition-all duration-300 ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {product.name}
            </h3>
            <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 animate-pulse">
              {product.category}
            </span>
          </div>

          {product.variant && (
            <div className="mb-2">
              <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {product.variant}
              </span>
            </div>
          )}

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">Free shipping</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`group relative overflow-hidden px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                isAddingToCart
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              } text-white`}
            >
              <span className="relative z-10 flex items-center">
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
                  <>
                    <svg
                      className="w-4 h-4 mr-2 transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
