import apiClient from './api.service';
import { CreatePaymentRequest, Payment } from '../shared/types/types.shared';

class PaymentService {
  async create(data: CreatePaymentRequest): Promise<Payment> {
    const response = await apiClient.post('/payment/create', data);
    return response.data;
  }

  async getMine(): Promise<Payment[]> {
    const response = await apiClient.get('/payment/me');
    return response.data;
  }

  async getById(id: string): Promise<Payment> {
    const response = await apiClient.get(`/payment/${id}`);
    return response.data;
  }
}

export const paymentService = new PaymentService();
