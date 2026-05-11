import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetUserSession } from '../session.actions';

export interface PaymentState {
  hasPaidAccessFee: boolean | null;
}

const initialState: PaymentState = {
  hasPaidAccessFee: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setAccessFeePaid: (state, action: PayloadAction<boolean>) => {
      state.hasPaidAccessFee = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserSession, () => initialState);
  },
});

export const { setAccessFeePaid } = paymentSlice.actions;
export default paymentSlice.reducer;
