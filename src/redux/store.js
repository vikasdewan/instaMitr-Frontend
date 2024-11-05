import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice.js";

const store = configureStore({
    reducer:{
        auth:authSlice.reducer
    }
})

export default store;