import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '../../shared/types/types.shared';
import { resetUserSession } from '../session.actions';

export interface RolesState {
  data: Role[];
}

const initialState: RolesState = {
  data: [],
};

const rolesSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserSession, () => initialState);
  },
});

export const { setRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
