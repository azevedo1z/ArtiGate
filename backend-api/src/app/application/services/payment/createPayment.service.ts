import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { CreatePaymentDTO } from '../../dtos/payment/createPayment.dto';
import { CreatePaymentPersistDTO } from '../../dtos/payment/paymentPersist.dto';
import { PaymentGatewayChargeRequestDTO } from '../../dtos/payment/paymentGatewayCharge.dto';
import { Payment } from '../../../domain/models/payment.model';
import { paymentRowToDomain } from '../../mappers/payment.mapper';
import {
  PaymentDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { PaymentGatewayAdapter } from '../../../interface/adapter/paymentGateway.adapter';
import {
  ConflictException,
  NotFoundException,
  PaymentGatewayException,
} from '../../../shared/exceptions/app.exception';
import { PAYMENT_ACCESS_FEE } from '../../../shared/constants';

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
    if (cached) return paymentRowToDomain(cached);

    const alreadyPaid =
      (await this.adapter.hasApprovedFeeByUserId?.(userId)) ?? false;

    if (alreadyPaid)
      throw new ConflictException('The access fee has already been paid.');

    const amount = PAYMENT_ACCESS_FEE;
    const currency = (
      dto.currency ??
      this.configService.get<string>('payment.defaultCurrency') ??
      'BRL'
    ).toUpperCase();

    const chargeRequest = new PaymentGatewayChargeRequestDTO({
      token: dto.token ?? null,
      amount,
      currency,
      description: dto.description ?? null,
      paymentMethodId: dto.paymentMethodId,
      payerEmail: dto.payerEmail,
      payerIdentificationType: dto.payerIdentification?.type ?? null,
      payerIdentificationNumber: dto.payerIdentification?.number ?? null,
      idempotencyKey: dto.idempotencyKey,
    });

    const chargeResult = await this.gateway.createCharge(chargeRequest);

    const persistData = new CreatePaymentPersistDTO({
      userId,
      amount: new Prisma.Decimal(amount.toFixed(2)),
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

    try {
      const persisted = await this.adapter.create(persistData);
      return paymentRowToDomain(persisted);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        const fallback = await this.adapter.findByIdempotencyKey?.(
          dto.idempotencyKey
        );
        if (fallback) return paymentRowToDomain(fallback);
      }

      this.logger.error(
        `Failed to persist payment after gateway success (gatewayPaymentId=${chargeResult.gatewayPaymentId})`,
        error instanceof Error ? error.stack : JSON.stringify(error)
      );
      throw new PaymentGatewayException(
        'Payment could not be completed. Please try again later.'
      );
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }
}
