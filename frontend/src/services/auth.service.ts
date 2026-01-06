import apiClient from './api.service';
import { SignInResponse, User } from '../shared/types/types.shared';

class AuthService {
  async signIn(email: string, password: string): Promise<SignInResponse> {
    const response = await apiClient.post('/user/signIn', {
      email: email.trim().toLowerCase(),
      password,
    });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/user/me');
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();
