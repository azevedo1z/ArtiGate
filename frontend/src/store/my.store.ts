import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';

const myStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof myStore.getState>;
export type AppDispatch = typeof myStore.dispatch;

export default myStore;
