import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../store/productSlice";
import { products as mockProducts } from "../data/products"; // Fallback data

const HomePage = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Get data from Redux store
  const {
    products,
    productsByCategory,
    categories: apiCategories,
    loading,
    error,
  } = useSelector((state) => state.products);

  // Determine if we should use API data or fallback to mock data
  const useApiData = products && products.length > 0;

  // Get categories from API or mock data
  const allCategories =
    useApiData && apiCategories.length > 0
      ? apiCategories
      : [...new Set(mockProducts.map((product) => product.category))];

  const categories = ["All", ...allCategories];

  // Get products to display based on selected category
  const getProductsToDisplay = () => {
    if (!useApiData) {
      // Use mock data if API data is not available
      return selectedCategory === "All"
        ? mockProducts
        : mockProducts.filter(
            (product) => product.category === selectedCategory
          );
    }

    // Use API data
    if (selectedCategory === "All") {
      return products;
    }

    // If we have the new data structure with productsByCategory
    if (productsByCategory && productsByCategory[selectedCategory]) {
      return productsByCategory[selectedCategory];
    }

    // Fallback to filtering the flattened products array
    return products.filter((product) => product.category === selectedCategory);
  };

  const displayProducts = getProductsToDisplay();

  // Fetch products on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products (which now includes categories)
        await dispatch(fetchProducts());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    window.scrollTo(0, 0); // Scroll to top when changing category
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Visa Services</h1>
        <p className="text-gray-600 max-w-3xl">
          Choose from our range of professional visa services to make your
          application process smooth and successful. Add multiple services to
          your cart and get a 10% discount when you bundle services from
          different categories!
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error loading products. Using fallback data.</p>
        </div>
      )}

      {loading || isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {selectedCategory === "All" && useApiData && productsByCategory ? (
            // Display products by category when "All" is selected and we have the new data structure
            <>
              {apiCategories.map((category) => {
                const categoryProducts = productsByCategory[category] || [];

                if (categoryProducts.length === 0) {
                  return null;
                }

                return (
                  <div key={category} className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={{
                            id: product._id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            category: product.category,
                            variant: product.variant,
                            image: product.image,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            // Display filtered products for a specific category or when using old data structure
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={{
                    id: product.id || product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    variant: product.variant,
                    image: product.image,
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
