import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost : null, //ye ek object rahega isliye null liya nahi toh array lete becuase it's a single post
  },
  reducers: {
    //actions
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost : (state, action) => {
      state.selectedPost = action.payload;
    }
  },
});

export const { setPosts, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
