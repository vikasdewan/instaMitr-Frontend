import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice.js";
import { postSlice } from "./postSlice.js";
import { chatSlice } from "./chatSlice.js";
import {socketSlice} from "./socketSlice.js";
import {realTimeNotiSlice} from "./realTimeNotiSlice.js";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  post: postSlice.reducer,
  socketio: socketSlice.reducer,
  realTimeNoti : realTimeNotiSlice.reducer,
  chat: chatSlice.reducer,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
