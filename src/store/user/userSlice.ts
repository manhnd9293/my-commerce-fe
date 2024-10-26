import { createSlice } from "@reduxjs/toolkit";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";
import { UserDto } from "@/dto/user/user.dto.ts";

export interface UserState extends UserDto {}

const initialState: UserState = {
  id: null,
  email: "",
  cart: [],
  avatarUrl: "",
};

const userSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    signIn: (state, action) => {
      const payload: UserDto = action.payload;
      state = structuredClone(payload);
      return state;
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
      localStorage.setItem("instantBuy", JSON.stringify(instantBuy));
      return state;
    },
    updateAvatar: (
      state,
      action: { payload: { avatarUrl: string | null } },
    ) => {
      const { avatarUrl } = action.payload;
      state.avatarUrl = avatarUrl;
      return state;
    },

    updateGeneralInfo(state, action) {
      const payload: UserDto = action.payload;
      state.fullName = payload.fullName;
      state.phone = payload.phone;
      state.dob = payload.dob;

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
  updateGeneralInfo,
} = userSlice.actions;

export default userSlice.reducer;
