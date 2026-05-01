import { PaymentStatus } from '../../shared/types/payment.types';
export class Payment {
  private _id: string;
  private _userId: string;
  private _amount: number;
  private _currency: string;
  private _status: PaymentStatus;
  private _description: string | null;
  private _paymentMethodId: string | null;
  private _payerEmail: string;
  private _gatewayPaymentId: string | null;
  private _idempotencyKey: string;
  private _failureReason: string | null;

  private constructor(
    id: string,
    userId: string,
    amount: number,
    currency: string,
    status: PaymentStatus,
    description: string | null,
    paymentMethodId: string | null,
    payerEmail: string,
    gatewayPaymentId: string | null,
    idempotencyKey: string,
    failureReason: string | null
  ) {
    this._id = id;
    this._userId = userId;
    this._amount = amount;
    this._currency = currency;
    this._status = status;
    this._description = description;
    this._paymentMethodId = paymentMethodId;
    this._payerEmail = payerEmail;
    this._gatewayPaymentId = gatewayPaymentId;
    this._idempotencyKey = idempotencyKey;
    this._failureReason = failureReason;
  }

  static factory(
    id: string,
    userId: string,
    amount: number,
    currency: string,
    status: PaymentStatus,
    description: string | null,
    paymentMethodId: string | null,
    payerEmail: string,
    gatewayPaymentId: string | null,
    idempotencyKey: string,
    failureReason: string | null
  ): Payment {
    return new Payment(
      id,
      userId,
      amount,
      currency,
      status,
      description,
      paymentMethodId,
      payerEmail,
      gatewayPaymentId,
      idempotencyKey,
      failureReason
    );
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get description(): string | null {
    return this._description;
  }

  get paymentMethodId(): string | null {
    return this._paymentMethodId;
  }

  get payerEmail(): string {
    return this._payerEmail;
  }

  get gatewayPaymentId(): string | null {
    return this._gatewayPaymentId;
  }

  get idempotencyKey(): string {
    return this._idempotencyKey;
  }

  get failureReason(): string | null {
    return this._failureReason;
  }
}
