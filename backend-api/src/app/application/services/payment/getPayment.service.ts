import { Injectable } from '@nestjs/common';
import { Payment as PaymentRow } from '@prisma/client';
import { Payment } from '../../../domain/models/payment.model';
import { PaymentStatus } from '../../../shared/types/payment.types';
import { PaymentDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';
import {
  PaginationDTO,
  buildPaginatedResult,
  normalizePagination,
} from '../../../shared/dtos/pagination.dto';

@Injectable()
export class GetPaymentService {
  constructor(private readonly adapter: PaymentDatabaseAdapter) {}

  async getById(id: string): Promise<Payment> {
    const existingPayment = await this.adapter.findById(id);

    if (existingPayment == null)
      throw new NotFoundException(`There is no payment with the ID "${id}".`);

    return this.toDomain(existingPayment);
  }

  async getAll(pagination?: PaginationDTO) {
    const { page, limit } = normalizePagination(pagination);
    const [rows, total] = await Promise.all([
      this.adapter.findAll(pagination),
      this.adapter.countAll?.() ?? Promise.resolve(0),
    ]);

    return buildPaginatedResult(
      rows.map((row) => this.toDomain(row)),
      total,
      page,
      limit
    );
  }

  async getByUserId(userId: string): Promise<Payment[]> {
    const rows = (await this.adapter.findManyByUserId?.(userId)) ?? [];

    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: PaymentRow): Payment {
    return Payment.factory(
      row.id,
      row.userId,
      Number(row.amount),
      row.currency,
      row.status as PaymentStatus,
      row.description,
      row.paymentMethodId,
      row.payerEmail,
      row.gatewayPaymentId,
      row.idempotencyKey,
      row.failureReason
    );
  }
}
