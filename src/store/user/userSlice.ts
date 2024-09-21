import { createSlice } from "@reduxjs/toolkit";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";

export interface UserState {
  id: number | null;
  email: string;
  cart: CartItemDto[];
}

const initialState: UserState = {
  id: null,
  email: "",
  cart: [],
};

const userSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    signIn: (state, action) => {
      const payload: UserState = action.payload;
      state.id = payload.id;
      state.email = payload.email;
      state.cart = payload.cart;
    },
    signOut: () => {
      localStorage.removeItem("accessToken");
      return initialState;
    },

    addCartItem: (state, action) => {
      const cartItem: CartItemDto = action.payload;
      const cart = state.cart;
      const index = cart.findIndex((item) => item.id === cartItem.id);
      if (index !== -1) {
        cart[index] = cartItem;
      } else {
        cart.push(cartItem);
      }
      return state;
    },

    removeCartItem: (state, action) => {
      const id = action.payload;
      console.log({ id });
      state.cart = state.cart.filter((item) => item.id !== id);
      return state;
    },

    updateCart: (state, action) => {
      const updateCart: CartItemDto[] = action.payload;
      state.cart = updateCart;
    },
  },
});

export const { signIn, signOut, addCartItem, removeCartItem } =
  userSlice.actions;
export default userSlice.reducer;
