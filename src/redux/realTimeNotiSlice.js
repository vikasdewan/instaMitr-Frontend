import { createSlice } from "@reduxjs/toolkit";

export const realTimeNotiSlice = createSlice({
    name:'realTimeNoti',
    initialState:{
        likeNotiList:[],
    },
    reducers:{
        setlikeNotiList(state,action){
            
            if(action.payload.type == 'like'){
                state.likeNotiList.push(action.payload);
            }else if(action.payload.type == 'dislike'){
                state.likeNotiList = state.likeNotiList.filter((item)=>item.userId != action.payload.userId); // jo user ne dislike kiya usko filterout kar rahe hai
            }

        }
    }

})

export const {setlikeNotiList} = realTimeNotiSlice.actions;
export default realTimeNotiSlice.reducer;