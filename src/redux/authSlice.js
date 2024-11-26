import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers : [],
    userProfile:null,
    selectedUser :null
  },
  reducers: {
    //actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile : (state, action)=>{
      state.userProfile = action.payload;
    },
    setSelectedUser : (state, action)=>{
      state.selectedUser = action.payload;
    }
  },
});

export const { setAuthUser, setSuggestedUsers, setUserProfile,selectedUser } = authSlice.actions;
export default authSlice.reducer;
