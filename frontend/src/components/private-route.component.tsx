import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? (children as React.ReactElement) : <Navigate to="/" replace />;
};

export default PrivateRoute;
