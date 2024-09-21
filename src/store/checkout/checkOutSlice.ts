import { createSlice } from "@reduxjs/toolkit";

const initialCheckOutIds: number[] = [];

const checkOutSlice = createSlice({
  name: "CheckOutSlice",
  initialState: initialCheckOutIds,
  reducers: {
    addCheckOutCartItemId: (state, action) => {
      const cartItemId: number = action.payload;
      state.push(cartItemId);
    },
    removeCheckOutCartItemId: (state, action) => {
      const cartItemId: number = action.payload;
      return state.filter((id) => id !== cartItemId);
    },
  },
});

export const { addCheckOutCartItemId, removeCheckOutCartItemId } =
  checkOutSlice.actions;
export default checkOutSlice.reducer;
