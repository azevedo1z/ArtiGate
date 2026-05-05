import { Prisma } from '@prisma/client';
import { PaymentStatus } from '../../../shared/types/payment.types';

export class CreatePaymentPersistDTO {
  userId: string;
  amount: Prisma.Decimal;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  paymentMethodId: string | null;
  payerEmail: string;
  gatewayPaymentId: string | null;
  idempotencyKey: string;
  failureReason: string | null;
  rawGatewayResponse: string | null;

  constructor(params: {
    userId: string;
    amount: Prisma.Decimal;
    currency: string;
    status: PaymentStatus;
    description: string | null;
    paymentMethodId: string | null;
    payerEmail: string;
    gatewayPaymentId: string | null;
    idempotencyKey: string;
    failureReason: string | null;
    rawGatewayResponse: string | null;
  }) {
    this.userId = params.userId;
    this.amount = params.amount;
    this.currency = params.currency;
    this.status = params.status;
    this.description = params.description;
    this.paymentMethodId = params.paymentMethodId;
    this.payerEmail = params.payerEmail;
    this.gatewayPaymentId = params.gatewayPaymentId;
    this.idempotencyKey = params.idempotencyKey;
    this.failureReason = params.failureReason;
    this.rawGatewayResponse = params.rawGatewayResponse;
  }
}

export class UpdatePaymentPersistDTO {
  id: string;
  status?: PaymentStatus;
  paymentMethodId?: string | null;
  failureReason?: string | null;
  rawGatewayResponse?: string | null;

  constructor(params: {
    id: string;
    status?: PaymentStatus;
    paymentMethodId?: string | null;
    failureReason?: string | null;
    rawGatewayResponse?: string | null;
  }) {
    this.id = params.id;
    this.status = params.status;
    this.paymentMethodId = params.paymentMethodId;
    this.failureReason = params.failureReason;
    this.rawGatewayResponse = params.rawGatewayResponse;
  }
}
