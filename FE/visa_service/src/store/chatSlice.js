import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../services/apiService";

// Async thunks for API calls
export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(message);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send message");
    }
  }
);

// Initial state
const initialState = {
  messages: [
    {
      text: "Hello! Welcome to ShopHub! How can I help you find the perfect products today?",
      isUser: false,
    },
  ],
  loading: false,
  error: null,
};

// Chat slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ text: action.payload, isUser: true });
    },
    clearChatError: (state) => {
      state.error = null;
    },
    resetChat: (state) => {
      state.messages = [
        {
          text: "Hello! Welcome to ShopHub! How can I help you find the perfect products today?",
          isUser: false,
        },
      ];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          text: action.payload.response.message,
          isUser: false,
          timestamp: action.payload.response.timestamp,
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send message";
        // Add a fallback message in case of API failure
        state.messages.push({
          text: "I'm sorry, I'm having trouble connecting to the server. Please try again later.",
          isUser: false,
        });
      });
  },
});

export const { addUserMessage, clearChatError, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
