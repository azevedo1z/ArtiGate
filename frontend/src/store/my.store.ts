import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user.slice';
import rolesReducer from './slices/roles.slice';

const myStore = configureStore({
  reducer: {
    user: userReducer,
    roles: rolesReducer,
  },
});

export type RootState = ReturnType<typeof myStore.getState>;
export type AppDispatch = typeof myStore.dispatch;

export default myStore;
