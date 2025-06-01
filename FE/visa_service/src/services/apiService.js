import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

// Base URL for API from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh or logout on 401 errors, but don't redirect
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it's a 401 error from an authenticated request (not login/register)
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config.url.includes("/login") &&
      !error.config.url.includes("/register")
    ) {
      // Clear token but don't redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authApi = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post("/users/register", userData);

      // Store token and user data if registration is successful
      if (response.data.success && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.data._id,
            name: response.data.data.name,
            email: response.data.data.email,
          })
        );
      }

      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/users/login", credentials);

      // Store token and user data if login is successful
      if (response.data.success && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.data._id,
            name: response.data.data.name,
            email: response.data.data.email,
          })
        );
      }

      return response.data;
    } catch (error) {
      // Check if it's a user not found error based on the message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes("User not found")
      ) {
        throw {
          message: "User not registered. Please register first.",
          notRegistered: true,
        };
      } else if (error.response && error.response.status === 401) {
        // For other 401 errors, treat as invalid credentials
        throw {
          message: "Invalid email or password. Please try again.",
          invalidCredentials: true,
        };
      }

      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/users/profile");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true, message: "Logged out successfully" };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Get current user data
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Product API endpoints
export const productApi = {
  // Get all products with categories
  getAllProducts: async () => {
    try {
      const response = await apiClient.get("/products");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Get all product variants
  getVariants: async () => {
    try {
      const response = await apiClient.get("/products/variants");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },
};

// Cart API endpoints
export const cartApi = {
  // Get user's cart
  getCart: async () => {
    try {
      // Check if user is authenticated
      if (!authApi.isAuthenticated()) {
        // Get local cart items
        const localCartItems = JSON.parse(
          localStorage.getItem("cartItems") || "[]"
        );

        // Get product details from localStorage if available
        const localProductDetails = JSON.parse(
          localStorage.getItem("productDetails") || "{}"
        );

        // Map cart items to include full product details
        const itemsWithDetails = localCartItems.map((item) => {
          const productDetails = localProductDetails[item.product] || {};

          return {
            product: {
              _id: item.product,
              name: productDetails.name || "Product",
              price: productDetails.price || 0,
              category: productDetails.category || "Unknown",
              image: productDetails.image || "",
              description: productDetails.description || "",
            },
            quantity: item.quantity,
          };
        });

        // Calculate totals
        const totalItems = itemsWithDetails.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalPrice = itemsWithDetails.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        return {
          success: true,
          data: {
            items: itemsWithDetails,
            totalPrice,
            totalItems,
            discount: 0,
            discountApplied: false,
          },
        };
      }

      const response = await apiClient.get("/cart");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, productDetails = null) => {
    try {
      // If not authenticated, store in localStorage
      if (!authApi.isAuthenticated()) {
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const existingItem = cartItems.find(
          (item) => item.product === productId
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cartItems.push({
            product: productId,
            quantity,
          });
        }

        // Save cart items
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Save product details in a separate localStorage item
        if (productDetails) {
          const storedProductDetails = JSON.parse(
            localStorage.getItem("productDetails") || "{}"
          );
          storedProductDetails[productId] = {
            name: productDetails.name,
            price: productDetails.price,
            category: productDetails.category,
            image: productDetails.image,
            description: productDetails.description,
          };
          localStorage.setItem(
            "productDetails",
            JSON.stringify(storedProductDetails)
          );
        }

        // Get product details for response
        const storedDetails = JSON.parse(
          localStorage.getItem("productDetails") || "{}"
        );
        const itemsWithDetails = cartItems.map((item) => {
          const details = storedDetails[item.product] || {};
          return {
            product: {
              _id: item.product,
              name: details.name || "Product",
              price: details.price || 0,
              category: details.category || "Unknown",
              image: details.image || "",
              description: details.description || "",
            },
            quantity: item.quantity,
          };
        });

        return {
          success: true,
          message: "Item added to cart",
          data: {
            items: itemsWithDetails,
            totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: itemsWithDetails.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            ),
          },
        };
      }

      const response = await apiClient.post("/cart", {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Update cart item
  updateCartItem: async (productId, quantity) => {
    try {
      // If not authenticated, update in localStorage
      if (!authApi.isAuthenticated()) {
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const existingItem = cartItems.find(
          (item) => item.product === productId
        );

        if (existingItem) {
          existingItem.quantity = quantity;
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Get product details for response
        const storedDetails = JSON.parse(
          localStorage.getItem("productDetails") || "{}"
        );
        const itemsWithDetails = cartItems.map((item) => {
          const details = storedDetails[item.product] || {};
          return {
            product: {
              _id: item.product,
              name: details.name || "Product",
              price: details.price || 0,
              category: details.category || "Unknown",
              image: details.image || "",
              description: details.description || "",
            },
            quantity: item.quantity,
          };
        });

        return {
          success: true,
          message: "Cart item updated",
          data: {
            items: itemsWithDetails,
            totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: itemsWithDetails.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            ),
          },
        };
      }

      const response = await apiClient.put("/cart", {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      // If not authenticated, remove from localStorage
      if (!authApi.isAuthenticated()) {
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const updatedItems = cartItems.filter(
          (item) => item.product !== itemId
        );

        localStorage.setItem("cartItems", JSON.stringify(updatedItems));

        // Get product details for response
        const storedDetails = JSON.parse(
          localStorage.getItem("productDetails") || "{}"
        );
        const itemsWithDetails = updatedItems.map((item) => {
          const details = storedDetails[item.product] || {};
          return {
            product: {
              _id: item.product,
              name: details.name || "Product",
              price: details.price || 0,
              category: details.category || "Unknown",
              image: details.image || "",
              description: details.description || "",
            },
            quantity: item.quantity,
          };
        });

        return {
          success: true,
          message: "Item removed from cart",
          data: {
            items: itemsWithDetails,
            totalItems: updatedItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            ),
            totalPrice: itemsWithDetails.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            ),
          },
        };
      }

      const response = await apiClient.delete(`/cart/${itemId}`);
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      // If not authenticated, clear localStorage cart
      if (!authApi.isAuthenticated()) {
        localStorage.setItem("cartItems", JSON.stringify([]));
        return {
          success: true,
          message: "Cart cleared successfully",
          data: { items: [] },
        };
      }

      const response = await apiClient.delete("/cart/clear");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Merge local cart with server cart after login
  mergeCart: async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");

      // If there are no local items, no need to merge
      if (localCart.length === 0) {
        return { success: true, message: "No items to merge" };
      }

      // Add each local item to the server cart
      for (const item of localCart) {
        await apiClient.post("/cart", {
          productId: item.product,
          quantity: item.quantity,
        });
      }

      // Clear local cart after merging
      localStorage.setItem("cartItems", JSON.stringify([]));

      // Get the updated cart
      const response = await apiClient.get("/cart");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Apply coupon to cart
  applyCoupon: async (couponCode) => {
    try {
      if (!authApi.isAuthenticated()) {
        throw new Error("Authentication required to apply coupon");
      }

      const response = await apiClient.post("/cart/coupon", {
        couponCode,
      });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Remove coupon from cart
  removeCoupon: async () => {
    try {
      if (!authApi.isAuthenticated()) {
        throw new Error("Authentication required to remove coupon");
      }

      const response = await apiClient.delete("/cart/coupon");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },
};

// Checkout API endpoints
export const checkoutApi = {
  // Process checkout - Creates an order from the user's current cart
  processCheckout: async () => {
    try {
      // Authentication is required for checkout
      if (!authApi.isAuthenticated()) {
        throw new Error("Authentication required for checkout");
      }

      // No request body needed - uses authenticated user's cart
      const response = await apiClient.post("/checkout");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Get all orders for the current authenticated user
  getOrderHistory: async () => {
    try {
      // Only available for authenticated users
      if (!authApi.isAuthenticated()) {
        throw new Error("Authentication required");
      }

      const response = await apiClient.get("/checkout/orders");
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },

  // Get a specific order by ID
  getOrderById: async (orderId) => {
    try {
      // Authentication is required
      if (!authApi.isAuthenticated()) {
        throw new Error("Authentication required");
      }

      const response = await apiClient.get(`/checkout/orders/${orderId}`);
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },
};

// Chat API endpoints
export const chatApi = {
  // Send message
  sendMessage: async (message) => {
    try {
      const response = await apiClient.post("/chat", { message });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  },
};

// For development/testing - mock API responses
export const mockApiResponses = {
  // Mock function to simulate API calls during development
  mockResponse: (data, delay = 500) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, ...data });
      }, delay);
    });
  },

  // Mock user registration
  mockRegister: (userData, delay = 800) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = "user_" + Math.random().toString(36).substring(2, 10);
        const token =
          "mock_token_" + Math.random().toString(36).substring(2, 15);

        resolve({
          success: true,
          message: "User registered successfully",
          data: {
            _id: userId,
            name: userData.name,
            email: userData.email,
            token: token,
          },
        });
      }, delay);
    });
  },

  // Mock user login
  mockLogin: (credentials, delay = 600) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (!credentials.email || !credentials.password) {
          return reject({
            success: false,
            message: "Email and password are required",
          });
        }

        // Simulate user not found (for testing purposes)
        // In a real app, you'd check against a database
        if (credentials.email === "nonexistent@example.com") {
          return reject({
            response: {
              status: 401,
              data: {
                success: false,
                message:
                  "User not found. Please check your email and try again.",
              },
            },
          });
        }

        // Simulate invalid credentials
        if (
          credentials.email === "user@example.com" &&
          credentials.password !== "password123"
        ) {
          return reject({
            response: {
              status: 401,
              data: {
                success: false,
                message:
                  "Invalid credentials. Please check your email and password.",
              },
            },
          });
        }

        const userId = "user_" + Math.random().toString(36).substring(2, 10);
        const token =
          "mock_token_" + Math.random().toString(36).substring(2, 15);

        resolve({
          success: true,
          message: "Login successful",
          data: {
            _id: userId,
            name: "Mock User",
            email: credentials.email,
            token: token,
          },
        });
      }, delay);
    });
  },

  // Mock get user profile
  mockGetProfile: (delay = 500) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        resolve({
          success: true,
          data: {
            _id:
              userData.id ||
              "user_" + Math.random().toString(36).substring(2, 10),
            name: userData.name || "Mock User",
            email: userData.email || "user@example.com",
          },
        });
      }, delay);
    });
  },

  // Mock checkout session creation
  mockCheckoutSession: (
    cartId,
    customerInfo,
    cartItems = [],
    cartTotal = 0,
    delay = 1000
  ) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random order ID with a specific format
        const orderId =
          "ORD-" +
          Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");

        resolve({
          success: true,
          sessionId: "sess_" + Math.random().toString(36).substring(2, 15),
          order: {
            _id: orderId,
            customerInfo,
            items: cartItems,
            totalPrice: cartTotal > 0 ? cartTotal : 199.99, // Use calculated total or fallback
            status: "completed",
            createdAt: new Date().toISOString(),
            paymentMethod: "Credit Card",
            shippingMethod: "Standard Delivery",
          },
        });
      }, delay);
    });
  },

  // Mock order status
  mockOrderStatus: (orderId, delay = 700) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          order: {
            _id: orderId,
            status: "completed",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalPrice: 199.99,
            items: [
              {
                name: "Visa Application Review",
                price: 99.99,
                quantity: 1,
              },
              {
                name: "Document Verification",
                price: 49.99,
                quantity: 2,
              },
            ],
          },
        });
      }, delay);
    });
  },

  // Mock order history
  mockOrderHistory: (delay = 900) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              _id:
                "ORD-" +
                Math.floor(Math.random() * 1000000)
                  .toString()
                  .padStart(6, "0"),
              status: "completed",
              createdAt: new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              totalPrice: 199.99,
            },
            {
              _id:
                "ORD-" +
                Math.floor(Math.random() * 1000000)
                  .toString()
                  .padStart(6, "0"),
              status: "completed",
              createdAt: new Date(
                Date.now() - 14 * 24 * 60 * 60 * 1000
              ).toISOString(),
              totalPrice: 149.99,
            },
          ],
        });
      }, delay);
    });
  },

  // Mock checkout
  mockCheckout: (orderData, delay = 1200) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId =
          "ORD-" +
          Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");

        resolve({
          success: true,
          message: "Order placed successfully",
          data: {
            orderId: orderId,
            orderDetails: {
              ...orderData,
              _id: orderId,
              status: "completed",
              createdAt: new Date().toISOString(),
            },
          },
        });
      }, delay);
    });
  },
};

export default {
  authApi,
  productApi,
  cartApi,
  checkoutApi,
  chatApi,
  mockApiResponses,
};
