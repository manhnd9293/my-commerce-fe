import { createSlice } from '@reduxjs/toolkit';
import { CartItemDto } from '@/dto/cart/cart-item.dto.ts';

export interface UserState {
  id: number | null,
  email: string,
  cart: CartItemDto []
}

const initialState: UserState  = {
  id: null,
  email: '',
  cart: []
}

const userSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {
    signIn: (state, action) => {
      const payload : UserState = action.payload;
      state.id = payload.id
      state.email = payload.email
      state.cart = payload.cart
    },
    signOut: () => {
      localStorage.removeItem('accessToken');
      return initialState;
    }
  }
});

export const {signIn, signOut} = userSlice.actions;
export default userSlice.reducer;
