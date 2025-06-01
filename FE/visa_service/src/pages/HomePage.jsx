import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import { fetchProducts } from "../store/productSlice";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from "../store/toastSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const {
    products,
    productsByCategory,
    categories: apiCategories,
    loading,
    error,
  } = useSelector((state) => state.products);

  const useApiData = products && products.length > 0;
  const allCategories = apiCategories;
  const categories = ["All", ...allCategories];

  const getProductsToDisplay = () => {
    if (selectedCategory === "All") {
      return products;
    }

    if (productsByCategory && productsByCategory[selectedCategory]) {
      return productsByCategory[selectedCategory];
    }

    return products.filter((product) => product.category === selectedCategory);
  };

  const displayProducts = getProductsToDisplay();

  // Get featured products (first 8 products)
  const featuredProducts = products?.slice(0, 9) || [];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchProducts());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Smooth scroll to products section instead of top
    setTimeout(() => scrollToProducts(), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative pt-20 lg:pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-in slide-in-from-bottom-4 duration-1000">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                ShopHub
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              Discover amazing products across multiple categories including
              watches, toys, sports equipment, dresses, jewelry and more!
              <span className="font-semibold text-blue-600">
                {" "}
                Get 10% off
              </span>{" "}
              when you purchase products from different categories!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-in slide-in-from-bottom-4 duration-1000 delay-400">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">
                  {products?.length || 0}+
                </div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {allCategories?.length || 0}+
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">10%</div>
                <div className="text-sm text-gray-600">Bundle Discount</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">Free</div>
                <div className="text-sm text-gray-600">Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Featured Products Carousel */}
        {featuredProducts.length > 0 && (
          <div className="mb-16">
            <ProductCarousel
              products={featuredProducts}
              title="✨ Featured Products"
              autoscroll={true}
            />
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Shop by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p>Error loading products. Using fallback data.</p>
            </div>
          </div>
        )}

        {loading || isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 opacity-20"></div>
            </div>
          </div>
        ) : (
          <div id="products-section">
            {selectedCategory === "All" && useApiData && productsByCategory ? (
              <>
                {allCategories.map((category) => {
                  const categoryProducts = productsByCategory[category] || [];

                  if (categoryProducts.length === 0) {
                    return null;
                  }

                  return (
                    <div key={category} className="mb-16">
                      <ProductCarousel
                        products={categoryProducts.slice(0, 9)}
                        title={`🏷️ ${category}`}
                        autoscroll={false}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                  {selectedCategory === "All"
                    ? "All Products"
                    : selectedCategory}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {displayProducts.map((product, index) => (
                    <div
                      key={product.id || product._id}
                      className="animate-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ProductCard
                        product={{
                          id: product.id || product._id,
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          category: product.category,
                          variant: product.variant,
                          image: product.image,
                          quantity: product.quantity,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
