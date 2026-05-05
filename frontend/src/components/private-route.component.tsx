import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import { useUser } from '../hooks/useUser';
import { setUser } from '../store/slices/user.slice';
import { authService } from '../services/auth.service';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const userData = useUser();
  const token = localStorage.getItem('access_token');
  const [bootstrapFailed, setBootstrapFailed] = useState(false);

  useEffect(() => {
    if (!token || userData) return;

    let cancelled = false;
    authService
      .getCurrentUser()
      .then((data) => {
        if (cancelled) return;

        dispatch(setUser(data));
      })
      .catch(() => {
        if (cancelled) return;

        localStorage.removeItem('access_token');
        setBootstrapFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token, userData, dispatch]);

  if (!token || bootstrapFailed)
    return <Navigate to={ROUTES.LANDING} replace />;

  if (!userData) return null;

  return children as React.ReactElement;
};

export default PrivateRoute;
