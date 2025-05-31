import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: (state, action) => {
      const { message, type = "success", duration = 3000 } = action.payload;
      const id = Date.now() + Math.random();

      state.toasts.push({
        id,
        message,
        type,
        duration,
        timestamp: Date.now(),
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;

// Helper functions for different toast types
export const showSuccessToast = (message, duration) =>
  addToast({ message, type: "success", duration });

export const showErrorToast = (message, duration) =>
  addToast({ message, type: "error", duration });

export const showWarningToast = (message, duration) =>
  addToast({ message, type: "warning", duration });

export const showInfoToast = (message, duration) =>
  addToast({ message, type: "info", duration });

export default toastSlice.reducer;
