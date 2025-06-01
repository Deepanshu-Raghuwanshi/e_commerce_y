import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../services/apiService";

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (
    { productId, quantity = 1, productDetails = null },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartApi.addToCart(
        productId,
        quantity,
        productDetails
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add item to cart"
      );
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartItem(productId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update cart item"
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeFromCart(productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to remove item from cart"
      );
    }
  }
);

export const clearCartItems = createAsyncThunk(
  "cart/clearCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to clear cart");
    }
  }
);

export const applyCouponToCart = createAsyncThunk(
  "cart/applyCouponToCart",
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await cartApi.applyCoupon(couponCode);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to apply coupon");
    }
  }
);

export const removeCouponFromCart = createAsyncThunk(
  "cart/removeCouponFromCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeCoupon();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove coupon");
    }
  }
);

// Local storage functions for fallback
const loadCartFromStorage = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { items: [], totalAmount: 0 };
  }
  return { items: [], totalAmount: 0 };
};

const saveCartToStorage = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const calculateDiscount = (items, couponApplied = false) => {
  // Check if there are at least 2 items from different categories
  const categories = new Set();
  items.forEach((item) => categories.add(item.category));

  const discountEligible = categories.size >= 2;

  if (discountEligible && couponApplied) {
    // Apply 10% discount only if coupon is applied
    return { discountRate: 0.1, discountEligible: true };
  }
  return { discountRate: 0, discountEligible };
};

const calculateTotals = (items, couponApplied = false) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const { discountRate, discountEligible } = calculateDiscount(
    items,
    couponApplied
  );
  const discountAmount = subtotal * discountRate;
  const totalAmount = subtotal - discountAmount;

  return {
    subtotal,
    discountRate,
    discountAmount,
    totalAmount,
    discountEligible,
  };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: initialState.items || [],
    subtotal: initialState.subtotal || 0,
    discountRate: initialState.discountRate || 0,
    discountAmount: initialState.discountAmount || 0,
    totalAmount: initialState.totalAmount || 0,
    discountEligible: initialState.discountEligible || false,
    couponApplied: initialState.couponApplied || false,
    couponCode: initialState.couponCode || null,
    loading: false,
    error: null,
    isOnline: true, // Flag to track online/offline status
  },
  reducers: {
    // Local reducers for offline functionality
    addToCart: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      const totals = calculateTotals(state.items, state.couponApplied);
      state.subtotal = totals.subtotal;
      state.discountRate = totals.discountRate;
      state.discountAmount = totals.discountAmount;
      state.totalAmount = totals.totalAmount;
      state.discountEligible = totals.discountEligible;

      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const totals = calculateTotals(state.items, state.couponApplied);
      state.subtotal = totals.subtotal;
      state.discountRate = totals.discountRate;
      state.discountAmount = totals.discountAmount;
      state.totalAmount = totals.totalAmount;
      state.discountEligible = totals.discountEligible;

      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.quantity = Math.max(1, quantity);
      }

      const totals = calculateTotals(state.items, state.couponApplied);
      state.subtotal = totals.subtotal;
      state.discountRate = totals.discountRate;
      state.discountAmount = totals.discountAmount;
      state.totalAmount = totals.totalAmount;
      state.discountEligible = totals.discountEligible;

      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discountRate = 0;
      state.discountAmount = 0;
      state.totalAmount = 0;
      state.discountEligible = false;
      state.couponApplied = false;
      state.couponCode = null;

      saveCartToStorage(state);
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the response structure - check if data exists
        const cartData = action.payload.data || action.payload.cart || {};

        if (cartData && cartData.items && Array.isArray(cartData.items)) {
          state.items = cartData.items
            .map((item) => {
              // Make sure product exists and has the expected properties
              if (!item.product) {
                console.warn("Item missing product data:", item);
                return null;
              }

              return {
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                category: item.product.category,
                quantity: item.quantity,
                image: item.product.image,
                description: item.product.description,
              };
            })
            .filter(Boolean); // Remove any null items

          // Update cart state with server data
          state.totalAmount = cartData.totalPrice || 0;
          state.couponApplied = cartData.couponApplied || false;
          state.couponCode = cartData.couponCode || null;
          state.discountEligible = cartData.discountEligible || false;

          // Calculate other values
          const totals = calculateTotals(state.items, state.couponApplied);
          state.subtotal = totals.subtotal;
          state.discountRate = totals.discountRate;
          state.discountAmount = totals.discountAmount;

          saveCartToStorage(state);
        } else {
          console.warn(
            "Cart data structure is not as expected:",
            action.payload
          );
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the response structure - check if data exists
        const cartData = action.payload.data || action.payload.cart || {};

        if (cartData && cartData.items && Array.isArray(cartData.items)) {
          state.items = cartData.items
            .map((item) => {
              // Make sure product exists and has the expected properties
              if (!item.product) {
                console.warn("Item missing product data:", item);
                return null;
              }

              return {
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                category: item.product.category,
                quantity: item.quantity,
                image: item.product.image,
                description: item.product.description,
              };
            })
            .filter(Boolean); // Remove any null items

          // Update cart state with server data
          state.totalAmount = cartData.totalPrice || 0;
          state.couponApplied = cartData.couponApplied || false;
          state.couponCode = cartData.couponCode || null;
          state.discountEligible = cartData.discountEligible || false;

          // Calculate other values
          const totals = calculateTotals(state.items, state.couponApplied);
          state.subtotal = totals.subtotal;
          state.discountRate = totals.discountRate;
          state.discountAmount = totals.discountAmount;

          saveCartToStorage(state);
        } else {
          console.warn(
            "Cart data structure is not as expected:",
            action.payload
          );
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add item to cart";
      })

      // Update cart item
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the response structure - check if data exists
        const cartData = action.payload.data || action.payload.cart || {};

        if (cartData && cartData.items && Array.isArray(cartData.items)) {
          state.items = cartData.items
            .map((item) => {
              // Make sure product exists and has the expected properties
              if (!item.product) {
                console.warn("Item missing product data:", item);
                return null;
              }

              return {
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                category: item.product.category,
                quantity: item.quantity,
                image: item.product.image,
                description: item.product.description,
              };
            })
            .filter(Boolean); // Remove any null items

          // Update cart state with server data
          state.totalAmount = cartData.totalPrice || 0;
          state.couponApplied = cartData.couponApplied || false;
          state.couponCode = cartData.couponCode || null;
          state.discountEligible = cartData.discountEligible || false;

          // Calculate other values
          const totals = calculateTotals(state.items, state.couponApplied);
          state.subtotal = totals.subtotal;
          state.discountRate = totals.discountRate;
          state.discountAmount = totals.discountAmount;

          saveCartToStorage(state);
        } else {
          console.warn(
            "Cart data structure is not as expected:",
            action.payload
          );
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update cart item";
      })

      // Remove item from cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the response structure - check if data exists
        const cartData = action.payload.data || action.payload.cart || {};

        if (cartData && cartData.items && Array.isArray(cartData.items)) {
          state.items = cartData.items
            .map((item) => {
              // Make sure product exists and has the expected properties
              if (!item.product) {
                console.warn("Item missing product data:", item);
                return null;
              }

              return {
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                category: item.product.category,
                quantity: item.quantity,
                image: item.product.image,
                description: item.product.description,
              };
            })
            .filter(Boolean); // Remove any null items

          // Update cart state with server data
          state.totalAmount = cartData.totalPrice || 0;
          state.couponApplied = cartData.couponApplied || false;
          state.couponCode = cartData.couponCode || null;
          state.discountEligible = cartData.discountEligible || false;

          // Calculate other values
          const totals = calculateTotals(state.items, state.couponApplied);
          state.subtotal = totals.subtotal;
          state.discountRate = totals.discountRate;
          state.discountAmount = totals.discountAmount;

          saveCartToStorage(state);
        } else {
          console.warn(
            "Cart data structure is not as expected:",
            action.payload
          );
        }
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item from cart";
      })

      // Clear cart
      .addCase(clearCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.subtotal = 0;
        state.discountRate = 0;
        state.discountAmount = 0;
        state.totalAmount = 0;
        state.discountEligible = false;
        state.couponApplied = false;
        state.couponCode = null;

        saveCartToStorage(state);
      })
      .addCase(clearCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      })

      // Apply coupon
      .addCase(applyCouponToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCouponToCart.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the response structure
        const cartData = action.payload.data || action.payload.cart || {};

        if (cartData && cartData.items && Array.isArray(cartData.items)) {
          state.items = cartData.items
            .map((item) => {
              if (!item.product) {
                console.warn("Item missing product data:", item);
                return null;
              }

              return {
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                category: item.product.category,
                quantity: item.quantity,
                image: item.product.image,
                description: item.product.description,
              };
            })
            .filter(Boolean);

          // Update cart state with server data
          state.totalAmount = cartData.totalPrice || 0;
          state.couponApplied = cartData.couponApplied || false;
          state.couponCode = cartData.couponCode || null;
          state.discountEligible = cartData.discountEligible || false;

          // Calculate other values
          const totals = calculateTotals(state.items, state.couponApplied);
          state.subtotal = totals.subtotal;
          state.discountRate = totals.discountRate;
          state.discountAmount = totals.discountAmount;

          saveCartToStorage(state);
        }
      })
      .addCase(applyCouponToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to apply coupon";
      })

      // Remove coupon
      .addCase(removeCouponFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCouponFromCart.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the response structure
        const cartData = action.payload.data || action.payload.cart || {};

        if (cartData && cartData.items && Array.isArray(cartData.items)) {
          state.items = cartData.items
            .map((item) => {
              if (!item.product) {
                console.warn("Item missing product data:", item);
                return null;
              }

              return {
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                category: item.product.category,
                quantity: item.quantity,
                image: item.product.image,
                description: item.product.description,
              };
            })
            .filter(Boolean);

          // Update cart state with server data
          state.totalAmount = cartData.totalPrice || 0;
          state.couponApplied = cartData.couponApplied || false;
          state.couponCode = cartData.couponCode || null;
          state.discountEligible = cartData.discountEligible || false;

          // Calculate other values
          const totals = calculateTotals(state.items, state.couponApplied);
          state.subtotal = totals.subtotal;
          state.discountRate = totals.discountRate;
          state.discountAmount = totals.discountAmount;

          saveCartToStorage(state);
        }
      })
      .addCase(removeCouponFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove coupon";
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setOnlineStatus,
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
