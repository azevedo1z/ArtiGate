import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../shared/types/types.shared';
import { resetUserSession } from '../session.actions';

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
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserSession, () => initialState);
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
