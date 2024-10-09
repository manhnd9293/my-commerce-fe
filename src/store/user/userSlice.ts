import { createSlice } from "@reduxjs/toolkit";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";

export interface UserState {
  id: number | null;
  email: string;
  cart: CartItemDto[];
  instantBuy: CartItemDto | null;
  avatarUrl: string | null;
}

const initialState: UserState = {
  id: null,
  email: "",
  cart: [],
  instantBuy: null,
  avatarUrl: "",
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
      state.avatarUrl = payload.avatarUrl;
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
      state.cart = state.cart.filter((item) => item.id !== id);
      return state;
    },

    updateCartItemCheckOut: (state, action) => {
      const data: CartItemDto = action.payload;
      const index = state.cart.findIndex((item) => item.id === data.id);
      state.cart[index].isCheckedOut = data.isCheckedOut;

      return state;
    },

    updateCart: (state, action) => {
      const updateCart: CartItemDto[] = action.payload;
      state.cart = updateCart;
    },

    updateInstantBuy: (state, action: { payload: CartItemDto }) => {
      const instantBuy: CartItemDto = action.payload;
      state.instantBuy = instantBuy;
      return state;
    },
    updateAvatar: (state, action: { payload: { avatarUrl: string } }) => {
      const { avatarUrl } = action.payload;
      state.avatarUrl = avatarUrl;
      return state;
    },
  },
});

export const {
  signIn,
  signOut,
  addCartItem,
  removeCartItem,
  updateCartItemCheckOut,
  updateInstantBuy,
  updateAvatar,
} = userSlice.actions;
export default userSlice.reducer;
