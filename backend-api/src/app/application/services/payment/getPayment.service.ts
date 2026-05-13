import { Injectable } from '@nestjs/common';
import { Payment } from '../../../domain/models/payment.model';
import { PaymentRepository } from '../../../interface/repositories/payment.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetPaymentService {
  constructor(private readonly repo: PaymentRepository) {}

  async getById(id: string, requesterId: string): Promise<Payment> {
    const existing = await this.repo.findById(id);

    if (existing == null || existing.userId !== requesterId)
      throw new NotFoundException(`There is no payment with the ID "${id}".`);

    return existing;
  }

  async getByUserId(userId: string): Promise<Payment[]> {
    return this.repo.findManyByUserId(userId);
  }

  async getAccessFeeStatus(
    userId: string
  ): Promise<{ hasPaidAccessFee: boolean }> {
    const hasPaidAccessFee = await this.repo.hasApprovedFeeByUserId(userId);

    return { hasPaidAccessFee };
  }
}
