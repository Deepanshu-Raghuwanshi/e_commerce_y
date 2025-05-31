import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../services/apiService";
import { cartApi } from "../services/apiService";

// Async thunks for authentication
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.login(credentials);

      // After successful login, merge local cart with server cart
      if (response.success) {
        try {
          await cartApi.mergeCart();
        } catch (cartError) {
          console.error("Failed to merge cart:", cartError);
        }
      }

      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.notRegistered) {
        // Direct error from our API service
        return rejectWithValue({
          message: error.message,
          notRegistered: true,
        });
      } else if (error.invalidCredentials) {
        // Direct error from our API service
        return rejectWithValue({
          message: error.message,
          invalidCredentials: true,
        });
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Handle backend API error messages
        const errorMessage = error.response.data.message;

        if (errorMessage.includes("User not found")) {
          return rejectWithValue({
            message: "User not registered. Please register first.",
            notRegistered: true,
          });
        } else if (
          errorMessage.includes("Invalid credentials") ||
          errorMessage.includes("password")
        ) {
          return rejectWithValue({
            message: errorMessage,
            invalidCredentials: true,
          });
        }
      }

      // Handle other errors
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to get user profile"
      );
    }
  }
);

// Initial state
const initialState = {
  user: authApi.getCurrentUser(),
  isAuthenticated: authApi.isAuthenticated(),
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authApi.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;

        // Make sure we always have a properly formatted error object
        if (typeof action.payload === "string") {
          state.error = { message: action.payload };
        } else if (!action.payload) {
          state.error = { message: "Registration failed" };
        } else {
          // Store the full error object
          state.error = action.payload;
        }
      })

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        // Make sure we always have a properly formatted error object
        if (typeof action.payload === "string") {
          state.error = { message: action.payload };
        } else if (!action.payload) {
          state.error = { message: "Login failed" };
        } else {
          // Store the full error object to access notRegistered flag in the UI
          state.error = action.payload;
        }
      })

      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
        };
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;

        // Make sure we always have a properly formatted error object
        if (typeof action.payload === "string") {
          state.error = { message: action.payload };
        } else if (!action.payload) {
          state.error = { message: "Failed to get user profile" };
        } else {
          // Store the full error object
          state.error = action.payload;
        }
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
