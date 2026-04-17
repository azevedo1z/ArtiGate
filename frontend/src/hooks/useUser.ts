import { useSelector } from 'react-redux';
import { RootState } from '../store/my.store';

export const useUser = () => useSelector((state: RootState) => state.user.data);

export const useIsLoggedIn = () =>
  useSelector((state: RootState) => state.user.isLoggedIn);
