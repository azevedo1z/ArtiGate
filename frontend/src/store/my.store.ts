import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counter.slice';

const myStore = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof myStore.getState>;
export type AppDispatch = typeof myStore.dispatch;

export default myStore;
