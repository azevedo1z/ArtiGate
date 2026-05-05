import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user.slice';
import rolesReducer from './slices/roles.slice';
import paymentReducer from './slices/payment.slice';

const myStore = configureStore({
  reducer: {
    user: userReducer,
    roles: rolesReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof myStore.getState>;
export type AppDispatch = typeof myStore.dispatch;

export default myStore;
