import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../services/apiService";

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productApi.getAllProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch product");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // We'll get categories from the getAllProducts response
      const response = await productApi.getAllProducts();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch categories"
      );
    }
  }
);

export const fetchVariants = createAsyncThunk(
  "products/fetchVariants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getVariants();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch variants"
      );
    }
  }
);

// Initial state
const initialState = {
  products: [],
  productsByCategory: {},
  product: null,
  categories: [],
  variants: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
};

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the new data structure with categories
        if (action.payload.data) {
          // If we have the new structure with categories
          state.productsByCategory = action.payload.data;
          state.categories = action.payload.categories || [];

          // Flatten products for backward compatibility
          const allProducts = [];
          Object.values(action.payload.data).forEach((categoryProducts) => {
            allProducts.push(...categoryProducts);
          });
          state.products = allProducts;
        } else {
          // Fallback to old structure
          state.products = action.payload.products || action.payload.data || [];
        }

        // Handle pagination if available
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product";
      })

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the new data structure with categories
        if (action.payload.categories) {
          state.categories = action.payload.categories;
        }

        // Also update products and productsByCategory
        if (action.payload.data) {
          state.productsByCategory = action.payload.data;

          // Flatten products for backward compatibility
          const allProducts = [];
          Object.values(action.payload.data).forEach((categoryProducts) => {
            allProducts.push(...categoryProducts);
          });
          state.products = allProducts;
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      })

      // Fetch variants
      .addCase(fetchVariants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariants.fulfilled, (state, action) => {
        state.loading = false;
        state.variants = action.payload.variants;
      })
      .addCase(fetchVariants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch variants";
      });
  },
});

export const { setCurrentPage, clearProductError } = productSlice.actions;
export default productSlice.reducer;
