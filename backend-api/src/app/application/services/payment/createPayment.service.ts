import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment as PaymentRow, Prisma } from '@prisma/client';
import { CreatePaymentDTO } from '../../dtos/payment/createPayment.dto';
import { PaymentGatewayChargeRequestDTO } from '../../dtos/payment/paymentGatewayCharge.dto';
import { PaymentPersistDTO } from '../../dtos/payment/paymentPersist.dto';
import { Payment } from '../../../domain/models/payment.model';
import { PaymentStatus } from '../../../shared/types/payment.types';
import {
  PaymentDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { PaymentGatewayAdapter } from '../../../interface/adapter/paymentGateway.adapter';
import {
  NotFoundException,
  PaymentGatewayException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class CreatePaymentService {
  private readonly logger = new Logger(CreatePaymentService.name);

  constructor(
    private readonly adapter: PaymentDatabaseAdapter,
    private readonly userAdapter: UserDatabaseAdapter,
    private readonly gateway: PaymentGatewayAdapter,
    private readonly configService: ConfigService
  ) {}

  async execute(userId: string, dto: CreatePaymentDTO): Promise<Payment> {
    const existingUser = await this.userAdapter.findById(userId);
    if (existingUser == null)
      throw new NotFoundException(`There is no user with the ID "${userId}".`);

    const cached = await this.adapter.findByIdempotencyKey?.(
      dto.idempotencyKey
    );
    if (cached) return this.toDomain(cached);

    const currency = (
      dto.currency ??
      this.configService.get<string>('payment.defaultCurrency') ??
      'BRL'
    ).toUpperCase();

    const chargeRequest = new PaymentGatewayChargeRequestDTO({
      token: dto.token ?? null,
      amount: dto.amount,
      currency,
      description: dto.description ?? null,
      paymentMethodId: dto.paymentMethodId,
      payerEmail: dto.payerEmail,
      payerIdentificationType: dto.payerIdentification?.type ?? null,
      payerIdentificationNumber: dto.payerIdentification?.number ?? null,
      idempotencyKey: dto.idempotencyKey,
    });

    const chargeResult = await this.gateway.createCharge(chargeRequest);

    try {
      const persistData = new PaymentPersistDTO({
        userId,
        amount: new Prisma.Decimal(dto.amount.toFixed(2)),
        currency,
        status: chargeResult.status,
        description: dto.description ?? null,
        paymentMethodId: chargeResult.paymentMethodId ?? dto.paymentMethodId,
        payerEmail: dto.payerEmail,
        gatewayPaymentId: chargeResult.gatewayPaymentId || null,
        idempotencyKey: dto.idempotencyKey,
        failureReason: chargeResult.failureReason,
        rawGatewayResponse: chargeResult.rawResponse,
      });

      const persisted = await this.adapter.create(persistData as never);

      return this.toDomain(persisted);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        const fallback = await this.adapter.findByIdempotencyKey?.(
          dto.idempotencyKey
        );
        if (fallback) return this.toDomain(fallback);
      }

      this.logger.error(
        `Failed to persist payment after gateway success (gatewayPaymentId=${chargeResult.gatewayPaymentId})`,
        error instanceof Error ? error.stack : JSON.stringify(error)
      );
      throw new PaymentGatewayException(
        'Payment was processed but could not be recorded. Please contact support.'
      );
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
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
