import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    clearAccessFeeStatus: (state) => {
      state.hasPaidAccessFee = null;
    },
  },
});

export const { setAccessFeePaid, clearAccessFeeStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
