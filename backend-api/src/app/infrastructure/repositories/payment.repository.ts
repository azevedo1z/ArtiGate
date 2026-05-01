import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { PaymentDatabaseAdapter } from '../../interface/adapter/database.adapter';
import {
  PaymentPersistDTO,
  PaymentUpdateDTO,
} from '../../application/dtos/payment/paymentPersist.dto';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

@Injectable()
export class PaymentRepository implements PaymentDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: PaymentPersistDTO): Promise<Payment> {
    return await this.prisma.payment.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        description: data.description,
        paymentMethodId: data.paymentMethodId,
        payerEmail: data.payerEmail,
        gatewayPaymentId: data.gatewayPaymentId,
        idempotencyKey: data.idempotencyKey,
        failureReason: data.failureReason,
        rawGatewayResponse: data.rawGatewayResponse,
      },
    });
  }

  async update(data: PaymentUpdateDTO): Promise<Payment> {
    const { id, ...rest } = data;
    return await this.prisma.payment.update({
      where: { id },
      data: rest,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.payment.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<Payment | null> {
    return await this.prisma.payment.findFirst({
      where: { id, deletedOn: null },
    });
  }

  async findAll(pagination?: PaginationDTO): Promise<Payment[]> {
    const { skip, take } = normalizePagination(pagination);
    return await this.prisma.payment.findMany({
      where: { deletedOn: null },
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
  }

  async countAll(): Promise<number> {
    return await this.prisma.payment.count({ where: { deletedOn: null } });
  }

  async findMany(userId: string): Promise<Payment[]> {
    return await this.prisma.payment.findMany({
      where: { userId, deletedOn: null },
      orderBy: { createdOn: 'desc' },
    });
  }

  async findManyByUserId(userId: string): Promise<Payment[]> {
    return await this.findMany(userId);
  }

  async findByIdempotencyKey(key: string): Promise<Payment | null> {
    return await this.prisma.payment.findFirst({
      where: { idempotencyKey: key, deletedOn: null },
    });
  }

  async findByGatewayPaymentId(id: string): Promise<Payment | null> {
    return await this.prisma.payment.findFirst({
      where: { gatewayPaymentId: id, deletedOn: null },
    });
  }
}
