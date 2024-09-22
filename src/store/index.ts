import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
