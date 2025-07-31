import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RolesData } from '../../shared/types/types.shared';

export interface RolesState {
  data: RolesData[];
}

const initialState: RolesState = {
  data: [],
};

const rolesSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<RolesData[]>) => {
      state.data = action.payload;
    },
    clearRoles: (state) => {
      state.data = [];
    },
  },
});

export const { setRoles, clearRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
