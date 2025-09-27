import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComments: ( state, action) => {
      state.comments = action.payload;
    },
    addComment: (state, action) => {
      state.comments.unshift(action.payload); // Add at top
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
});

export const { setComments, addComment, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
