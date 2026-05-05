import { Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import {
  useAccessFeeStatus,
  useFetchAccessFeeStatus,
} from '../hooks/useAccessFee';

interface RequireAccessFeeProps {
  children: React.ReactNode;
}

const RequireAccessFee: React.FC<RequireAccessFeeProps> = ({ children }) => {
  useFetchAccessFeeStatus();
  const hasPaidAccessFee = useAccessFeeStatus();

  if (hasPaidAccessFee === null) return null;
  if (!hasPaidAccessFee) return <Navigate to={ROUTES.CHECKOUT} replace />;

  return children as React.ReactElement;
};

export default RequireAccessFee;
