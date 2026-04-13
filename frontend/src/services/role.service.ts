import apiClient from './api.service';
import { Role } from '../shared/types/types.shared';

class RoleService {
  async getAllRoles(): Promise<Role[]> {
    const response = await apiClient.get('/role/all');
    return response.data;
  }

  async getRolesByUserId(userId: string): Promise<Role[]> {
    const response = await apiClient.get(`/role/user/${userId}`);
    return response.data;
  }
}

export const roleService = new RoleService();
