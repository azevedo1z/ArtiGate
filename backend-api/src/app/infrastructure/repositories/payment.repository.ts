import { Injectable } from '@nestjs/common';
import { Payment as PaymentRow } from '@prisma/client';
import { Payment } from '../../domain/models/payment.model';
import { PaymentStatus } from '../../shared/types/payment.types';
import { PrismaService } from '../services/prisma.service';
import {
  CreatePaymentPersistDTO,
  UpdatePaymentPersistDTO,
} from '../../application/dtos/payment/paymentPersist.dto';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';
import { PaymentRepository } from '../../interface/repositories/payment.repository.port';

const rowToDomain = (row: PaymentRow): Payment =>
  Payment.factory({
    id: row.id,
    userId: row.userId,
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status as PaymentStatus,
    description: row.description,
    paymentMethodId: row.paymentMethodId,
    payerEmail: row.payerEmail,
    gatewayPaymentId: row.gatewayPaymentId,
    idempotencyKey: row.idempotencyKey,
    failureReason: row.failureReason,
  });

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePaymentPersistDTO): Promise<Payment> {
    const row = await this.prisma.payment.create({ data });
    return rowToDomain(row);
  }

  async update(data: UpdatePaymentPersistDTO): Promise<Payment> {
    const { id, ...rest } = data;
    const row = await this.prisma.payment.update({
      where: { id },
      data: rest,
    });
    return rowToDomain(row);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.payment.updateMany({
      where: { id, deletedOn: null },
      data: { deletedOn: new Date() },
    });
    return result.count > 0;
  }

  async findById(id: string): Promise<Payment | null> {
    const row = await this.prisma.payment.findFirst({ where: { id } });
    return row ? rowToDomain(row) : null;
  }

  async findAll(pagination?: PaginationDTO): Promise<Payment[]> {
    const { skip, take } = normalizePagination(pagination);
    const rows = await this.prisma.payment.findMany({
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
    return rows.map(rowToDomain);
  }

  async countAll(): Promise<number> {
    return this.prisma.payment.count();
  }

  async findManyByUserId(userId: string): Promise<Payment[]> {
    const rows = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdOn: 'desc' },
    });
    return rows.map(rowToDomain);
  }

  async findByIdempotencyKey(key: string): Promise<Payment | null> {
    const row = await this.prisma.payment.findFirst({
      where: { idempotencyKey: key },
    });
    return row ? rowToDomain(row) : null;
  }

  async findByGatewayPaymentId(id: string): Promise<Payment | null> {
    const row = await this.prisma.payment.findFirst({
      where: { gatewayPaymentId: id },
    });
    return row ? rowToDomain(row) : null;
  }

  async hasApprovedFeeByUserId(userId: string): Promise<boolean> {
    const count = await this.prisma.payment.count({
      where: { userId, status: 'approved' },
    });
    return count > 0;
  }
}
