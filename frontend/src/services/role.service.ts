import apiClient from './api.service';
import { Role } from '../shared/types/types.shared';

class RoleService {
  async getAllRoles(): Promise<Role[]> {
    const response = await apiClient.get('/role/all');
    return response.data;
  }

  async getMyRoles(): Promise<Role[]> {
    const response = await apiClient.get('/role/me');
    return response.data;
  }
}

export const roleService = new RoleService();
