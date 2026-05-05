import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';
import myStore from '../store/my.store';
import { setAccessFeePaid } from '../store/slices/payment.slice';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem('access_token');

    if (error.response?.status === 402)
      myStore.dispatch(setAccessFeePaid(false));

    return Promise.reject(error);
  }
);

export default apiClient;
