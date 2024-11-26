import { createSlice } from "@reduxjs/toolkit";
 

export const chatSlice = createSlice({
    name : "chat",
    initialState: {
        selectedUser :null,
        onlineUsers : [],
        messages : [],
      },
    reducers : {
        setSelectedUser : (state , action)=>{
            state.selectedUser = action.payload;
        },
        setOnlineUsers : (state , action)=>{
            state.onlineUsers = action.payload;
        },
        setMessages : (state, action)=>{
            state.messages = action.payload;
        }
    }
})

export const {setSelectedUser,setOnlineUsers,setMessages} = chatSlice.actions
export default chatSlice.reducer;