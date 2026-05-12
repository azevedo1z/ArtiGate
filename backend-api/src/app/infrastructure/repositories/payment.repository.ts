import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { PaymentDatabaseAdapter } from '../../interface/adapter/database.adapter';
import {
  CreatePaymentPersistDTO,
  UpdatePaymentPersistDTO,
} from '../../application/dtos/payment/paymentPersist.dto';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

@Injectable()
export class PaymentRepository implements PaymentDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePaymentPersistDTO): Promise<Payment> {
    return this.prisma.payment.create({ data });
  }

  async update(data: UpdatePaymentPersistDTO): Promise<Payment> {
    const { id, ...rest } = data;
    return this.prisma.payment.update({
      where: { id },
      data: rest,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.payment.updateMany({
      where: { id, deletedOn: null },
      data: { deletedOn: new Date() },
    });
    return result.count > 0;
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({ where: { id } });
  }

  async findAll(pagination?: PaginationDTO): Promise<Payment[]> {
    const { skip, take } = normalizePagination(pagination);
    return this.prisma.payment.findMany({
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
  }

  async countAll(): Promise<number> {
    return this.prisma.payment.count();
  }

  async findMany(userId: string): Promise<Payment[]> {
    return this.findManyByUserId(userId);
  }

  async findManyByUserId(userId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdOn: 'desc' },
    });
  }

  async findByIdempotencyKey(key: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { idempotencyKey: key },
    });
  }

  async findByGatewayPaymentId(id: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { gatewayPaymentId: id },
    });
  }

  async hasApprovedFeeByUserId(userId: string): Promise<boolean> {
    const count = await this.prisma.payment.count({
      where: { userId, status: 'approved' },
    });
    return count > 0;
  }
}
