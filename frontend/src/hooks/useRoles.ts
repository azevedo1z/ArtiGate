import { useSelector } from 'react-redux';
import { RootState } from '../store/my.store';
import { ROLES } from '../config/routes.config';

export const useRoles = () =>
  useSelector((state: RootState) => state.roles.data);

export const useIsReviewer = (): boolean => {
  const rolesData = useRoles();
  return rolesData?.some((role) => role._name === ROLES.REVIEWER) ?? false;
};
