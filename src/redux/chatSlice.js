import { createSlice } from "@reduxjs/toolkit";
 

export const chatSlice = createSlice({
    name : "chat",
    initialState: {
        selectedUser :null,
        onlineUsers : [],
      },
    reducers : {
        setSelectedUser : (state , action)=>{
            state.selectedUser = action.payload;
        },
        setOnlineUsers : (state , action)=>{
            state.onlineUsers = action.payload;
        },
    }
})

export const {setSelectedUser,setOnlineUsers} = chatSlice.actions
export default chatSlice.reducer;