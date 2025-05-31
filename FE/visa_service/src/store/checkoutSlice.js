import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkoutApi } from "../services/apiService";

// Async thunks for checkout
export const processCheckout = createAsyncThunk(
  "checkout/process",
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkoutApi.processCheckout();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Checkout failed"
      );
    }
  }
);

export const getOrderHistory = createAsyncThunk(
  "checkout/getOrderHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkoutApi.getOrderHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to get order history"
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  "checkout/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await checkoutApi.getOrderById(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to get order details"
      );
    }
  }
);

// Initial state
const initialState = {
  currentOrder: null,
  orderHistory: [],
  selectedOrder: null,
  loading: false,
  error: null,
  checkoutComplete: false,
};

// Checkout slice
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    resetCheckout: (state) => {
      state.currentOrder = null;
      state.error = null;
      state.checkoutComplete = false;
    },
    setCheckoutComplete: (state, action) => {
      state.checkoutComplete = action.payload;
    },
    clearCheckoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process checkout
      .addCase(processCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.checkoutComplete = false;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.checkoutComplete = true;
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.loading = false;

        // Make sure we always have a properly formatted error object
        if (typeof action.payload === "string") {
          state.error = { message: action.payload };
        } else if (!action.payload) {
          state.error = { message: "Checkout failed" };
        } else {
          state.error = action.payload;
        }

        state.checkoutComplete = false;
      })

      // Get order history
      .addCase(getOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload;
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.loading = false;

        // Make sure we always have a properly formatted error object
        if (typeof action.payload === "string") {
          state.error = { message: action.payload };
        } else if (!action.payload) {
          state.error = { message: "Failed to get order history" };
        } else {
          state.error = action.payload;
        }
      })

      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;

        // Make sure we always have a properly formatted error object
        if (typeof action.payload === "string") {
          state.error = { message: action.payload };
        } else if (!action.payload) {
          state.error = { message: "Failed to get order details" };
        } else {
          state.error = action.payload;
        }
      });
  },
});

export const { resetCheckout, setCheckoutComplete, clearCheckoutError } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
