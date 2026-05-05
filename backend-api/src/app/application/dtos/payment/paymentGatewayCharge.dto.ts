import { PaymentStatus } from '../../../shared/types/payment.types';

export class PaymentGatewayChargeRequestDTO {
  token: string | null;
  amount: number;
  currency: string;
  description: string | null;
  paymentMethodId: string;
  payerEmail: string;
  payerIdentificationType: string | null;
  payerIdentificationNumber: string | null;
  idempotencyKey: string;

  constructor(params: {
    token: string | null;
    amount: number;
    currency: string;
    description: string | null;
    paymentMethodId: string;
    payerEmail: string;
    payerIdentificationType: string | null;
    payerIdentificationNumber: string | null;
    idempotencyKey: string;
  }) {
    this.token = params.token;
    this.amount = params.amount;
    this.currency = params.currency;
    this.description = params.description;
    this.paymentMethodId = params.paymentMethodId;
    this.payerEmail = params.payerEmail;
    this.payerIdentificationType = params.payerIdentificationType;
    this.payerIdentificationNumber = params.payerIdentificationNumber;
    this.idempotencyKey = params.idempotencyKey;
  }
}

export class PaymentGatewayChargeResultDTO {
  gatewayPaymentId: string;
  status: PaymentStatus;
  paymentMethodId: string | null;
  failureReason: string | null;
  rawResponse: string;

  constructor(params: {
    gatewayPaymentId: string;
    status: PaymentStatus;
    paymentMethodId: string | null;
    failureReason: string | null;
    rawResponse: string;
  }) {
    this.gatewayPaymentId = params.gatewayPaymentId;
    this.status = params.status;
    this.paymentMethodId = params.paymentMethodId;
    this.failureReason = params.failureReason;
    this.rawResponse = params.rawResponse;
  }
}

export type PaymentGatewayWebhookHeaders = Record<string, string | undefined>;
