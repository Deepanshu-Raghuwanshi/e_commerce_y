import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "../store/cartSlice";
import Toast from "./Toast";

const ProductCardSimple = ({ product, onAddToCart }) => {
  const dispatch = useDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      // Call the parent component's add to cart function
      const result = await onAddToCart(product._id);

      // Check if the operation was successful
      if (result && result.success) {
        // Show success message
        setShowSuccessToast(true);

        // Refresh the cart to update the count in the navbar
        dispatch(fetchCart());
      } else {
        // If result exists but success is false
        if (result) {
          throw new Error(result.message || "Failed to add item to cart");
        }
        // If no result, assume success (backward compatibility)
        setShowSuccessToast(true);

        // Refresh the cart to update the count in the navbar
        dispatch(fetchCart());
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setErrorMessage(error.message || "Failed to add item to cart");
      setShowErrorToast(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-variant">{product.variant}</p>
        <p className="product-description">{product.description}</p>
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="add-to-cart-btn"
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>
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

export default ProductCardSimple;
