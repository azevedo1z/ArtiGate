import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter.slice';

export const myStore = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof myStore.getState>;
export type AppDispatch = typeof myStore.dispatch;
