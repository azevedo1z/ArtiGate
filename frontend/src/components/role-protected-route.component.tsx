import { Navigate } from 'react-router-dom';
import { useIsReviewer } from '../hooks/useRoles';
import { ROUTES, ROLES } from '../config/routes.config';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: (typeof ROLES)[keyof typeof ROLES];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const token = localStorage.getItem('access_token');
  const isReviewer = useIsReviewer();

  if (!token) return <Navigate to={ROUTES.LANDING} replace />;

  if (requiredRole === ROLES.REVIEWER && !isReviewer)
    return <Navigate to={ROUTES.HOME} replace />;

  return children as React.ReactElement;
};

export default RoleProtectedRoute;
