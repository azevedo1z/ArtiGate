import { configureStore } from '@reduxjs/toolkit';

const placeholderReducer = (state = {}, action: { type: string }) => state;

const myStore = configureStore({
  reducer: {
    placeholder: placeholderReducer,
  },
});

export type RootState = ReturnType<typeof myStore.getState>;
export type AppDispatch = typeof myStore.dispatch;

export default myStore;
