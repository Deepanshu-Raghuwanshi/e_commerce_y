import React from "react";
import ErrorBoundary from "./ErrorBoundary";

// Custom fallback UI component
const ErrorFallback = (error, errorInfo) => (
  <div className="error-fallback">
    <h2>Something went wrong in this component</h2>
    <p className="error-message">{error && error.message}</p>
    <button onClick={() => window.location.reload()} className="refresh-button">
      Refresh Page
    </button>
  </div>
);

// Example component that uses ErrorBoundary
const ProductList = ({ products }) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <div className="product-list">
        <h2>Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <p>{product.category}</p>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Example of using ErrorBoundary at a page level
const ProductPage = () => {
  return (
    <ErrorBoundary>
      <div className="product-page">
        <h1>Our Products</h1>
        <ProductList products={[]} />
        {/* Other components */}
      </div>
    </ErrorBoundary>
  );
};

export default ProductPage;
