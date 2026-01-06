import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../shared/types/types.shared';

export interface UserState {
  data: Pick<User, '_id' | '_name' | '_email'> | null;
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
    setUser: (state, action: PayloadAction<Pick<User, '_id' | '_name' | '_email'>>) => {
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
