import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '../../shared/types/types.shared';

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
    clearRoles: (state) => {
      state.data = [];
    },
  },
});

export const { setRoles, clearRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
