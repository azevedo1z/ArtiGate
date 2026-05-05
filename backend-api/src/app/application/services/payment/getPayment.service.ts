import { Injectable } from '@nestjs/common';
import { Payment } from '../../../domain/models/payment.model';
import { paymentRowToDomain } from '../../mappers/payment.mapper';
import { PaymentDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetPaymentService {
  constructor(private readonly adapter: PaymentDatabaseAdapter) {}

  async getById(id: string, requesterId: string): Promise<Payment> {
    const existingPayment = await this.adapter.findById(id);

    if (existingPayment == null || existingPayment.userId !== requesterId)
      throw new NotFoundException(`There is no payment with the ID "${id}".`);

    return paymentRowToDomain(existingPayment);
  }

  async getByUserId(userId: string): Promise<Payment[]> {
    const rows = (await this.adapter.findManyByUserId?.(userId)) ?? [];

    return rows.map((row) => paymentRowToDomain(row));
  }

  async getAccessFeeStatus(
    userId: string
  ): Promise<{ hasPaidAccessFee: boolean }> {
    const hasPaidAccessFee =
      (await this.adapter.hasApprovedFeeByUserId?.(userId)) ?? false;

    return { hasPaidAccessFee };
  }
}
