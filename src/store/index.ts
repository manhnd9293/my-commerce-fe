import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.ts";
import checkOutReducer from "./checkout/checkOutSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    checkOut: checkOutReducer,
  },
});
