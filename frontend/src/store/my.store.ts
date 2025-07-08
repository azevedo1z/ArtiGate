import { configureStore } from '@reduxjs/toolkit';

const myStore = configureStore({
  reducer: {
  },
});

export type RootState = ReturnType<typeof myStore.getState>;
export type AppDispatch = typeof myStore.dispatch;

export default myStore;
