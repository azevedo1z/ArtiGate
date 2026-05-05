import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/my.store';
import { setAccessFeePaid } from '../store/slices/payment.slice';
import { paymentService } from '../services/payment.service';

export const useAccessFeeStatus = () =>
  useSelector((state: RootState) => state.payment.hasPaidAccessFee);

export const useFetchAccessFeeStatus = (): void => {
  const dispatch = useDispatch();
  const status = useAccessFeeStatus();

  useEffect(() => {
    if (status !== null) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    let cancelled = false;
    paymentService
      .getAccessStatus()
      .then((result) => {
        if (cancelled) return;
        dispatch(setAccessFeePaid(result.hasPaidAccessFee));
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [dispatch, status]);
};
