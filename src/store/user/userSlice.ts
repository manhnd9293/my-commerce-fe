import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  id: number | null,
  email: string
}

const initialState: UserState  = {
  id: null,
  email: ''
}

const userSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {
    signIn: (state, action) => {
      const payload : UserState = action.payload;
      state.id = payload.id
      state.email = payload.email
    },
    signOut: (state) => {
      state = initialState;
    }
  }
});

export const {signIn} = userSlice.actions;
export default userSlice.reducer;