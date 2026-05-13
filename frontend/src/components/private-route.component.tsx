import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import { useUser } from '../hooks/useUser';
import { useRoles } from '../hooks/useRoles';
import { setUser } from '../store/slices/user.slice';
import { setRoles } from '../store/slices/roles.slice';
import { authService } from '../services/auth.service';
import { roleService } from '../services/role.service';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const userData = useUser();
  const rolesData = useRoles();
  const token = localStorage.getItem('access_token');
  const [bootstrapFailed, setBootstrapFailed] = useState(false);
  const [rolesLoaded, setRolesLoaded] = useState(false);

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

  useEffect(() => {
    if (!userData?._id) return;
    if (rolesData?.length) {
      setRolesLoaded(true);
      return;
    }

    let cancelled = false;
    roleService
      .getMyRoles()
      .then((data) => {
        if (cancelled) return;
        dispatch(setRoles(data));
        setRolesLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setRolesLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [userData, rolesData, dispatch]);

  if (!token || bootstrapFailed)
    return <Navigate to={ROUTES.LANDING} replace />;

  if (!userData || !rolesLoaded) return null;

  return children as React.ReactElement;
};

export default PrivateRoute;
