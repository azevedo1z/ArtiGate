import { Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? (
    (children as React.ReactElement)
  ) : (
    <Navigate to={ROUTES.LANDING} replace />
  );
};

export default PrivateRoute;
