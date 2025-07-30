import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../shared/types/types.shared';

export interface UserState {
  data: UserData | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  data: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.data = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
