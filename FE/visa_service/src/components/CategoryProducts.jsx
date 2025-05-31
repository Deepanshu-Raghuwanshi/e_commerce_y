// import React, { useEffect, useState } from "react";
// import useApi from "../hooks/useApi";
// import { productApi, cartApi } from "../services/apiService";
// import ErrorBoundary from "./ErrorBoundary";
// import ProductCardSimple from "./ProductCardSimple";
// import "./CategoryProducts.css";

// // Component to display products by category
// const CategorySection = ({ category, products, onAddToCart }) => {
//   return (
//     <div className="category-section">
//       <h2 className="category-title">{category}</h2>
//       <div className="products-grid">
//         {products.map((product) => (
//           <ProductCardSimple
//             key={product._id}
//             product={product}
//             onAddToCart={onAddToCart}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Main component to display all products by category
// const CategoryProducts = () => {
//   const [cartError, setCartError] = useState(null);

//   // Use the useApi hook with the getAllProducts function
//   const {
//     loading: productsLoading,
//     error: productsError,
//     data: productsData,
//     execute: fetchProducts,
//   } = useApi(productApi.getAllProducts);

//   // Fetch products on component mount
//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   // Handle add to cart
//   const handleAddToCart = async (productId) => {
//     try {
//       setCartError(null);

//       // Call the API directly
//       const response = await cartApi.addToCart(productId, 1);

//       // Return the full response to the child component
//       return response;
//     } catch (error) {
//       setCartError(error);
//       throw error; // Re-throw to be caught by the ProductCardSimple component
//     }
//   };

//   // Show loading state
//   if (productsLoading) {
//     return <div className="loading">Loading products...</div>;
//   }

//   // Show error state
//   if (productsError) {
//     return (
//       <div className="error-state">
//         <h3>Error loading products</h3>
//         <p>{productsError.message}</p>
//         <button onClick={() => fetchProducts()} className="retry-button">
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // If no data or empty data
//   if (!productsData || !productsData.data) {
//     return <div className="no-products">No products available</div>;
//   }

//   // Get categories and products
//   const { categories = [], data = {} } = productsData;

//   return (
//     <div className="category-products">
//       <h1>Our Products</h1>

//       {cartError && <div className="error-message">{cartError.message}</div>}

//       {/* Display categories in the order they appear in the categories array */}
//       {categories.map((category) => {
//         const categoryProducts = data[category] || [];

//         if (categoryProducts.length === 0) {
//           return null;
//         }

//         return (
//           <CategorySection
//             key={category}
//             category={category}
//             products={categoryProducts}
//             onAddToCart={handleAddToCart}
//           />
//         );
//       })}
//     </div>
//   );
// };

// // Wrap the component with ErrorBoundary
// const CategoryProductsWithErrorBoundary = () => (
//   <ErrorBoundary>
//     <CategoryProducts />
//   </ErrorBoundary>
// );

// export default CategoryProductsWithErrorBoundary;
