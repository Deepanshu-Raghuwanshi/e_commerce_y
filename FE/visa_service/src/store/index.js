import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import checkoutReducer from "./checkoutSlice";
import chatReducer from "./chatSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    checkout: checkoutReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "checkout/process/fulfilled",
          "checkout/getOrderHistory/fulfilled",
          "checkout/getOrderById/fulfilled",
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: [
          "checkout.currentOrder.items",
          "checkout.orderHistory",
          "checkout.selectedOrder",
        ],
      },
    }),
});

// Network status listener
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    import("./cartSlice").then(({ setOnlineStatus }) => {
      store.dispatch(setOnlineStatus(true));
    });
  });

  window.addEventListener("offline", () => {
    import("./cartSlice").then(({ setOnlineStatus }) => {
      store.dispatch(setOnlineStatus(false));
    });
  });
}

export default store;
