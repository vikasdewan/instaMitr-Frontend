import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUser: null,
    onlineUsers: [],
    messages: [],
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    updateMessageReaction: (state, action) => {
      const updatedMsg = action.payload;
      state.messages = state.messages.map((msg) =>
        msg._id === updatedMsg._id ? updatedMsg : msg
      );
    },
  },
});

export const {
  setSelectedUser,
  setOnlineUsers,
  setMessages,
  updateMessageReaction,
} = chatSlice.actions;

export default chatSlice.reducer;
