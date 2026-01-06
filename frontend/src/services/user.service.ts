import apiClient from './api.service';
import { CreateUserData, User } from '../shared/types/types.shared';

class UserService {
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post('/user/create', userData);
    return response.data;
  }
}

export const userService = new UserService();
