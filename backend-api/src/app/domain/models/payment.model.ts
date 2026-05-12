import { PaymentStatus } from '../../shared/types/payment.types';

export interface PaymentProps {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  paymentMethodId: string | null;
  payerEmail: string;
  gatewayPaymentId: string | null;
  idempotencyKey: string;
  failureReason: string | null;
}

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

  private constructor(props: PaymentProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._amount = props.amount;
    this._currency = props.currency;
    this._status = props.status;
    this._description = props.description;
    this._paymentMethodId = props.paymentMethodId;
    this._payerEmail = props.payerEmail;
    this._gatewayPaymentId = props.gatewayPaymentId;
    this._idempotencyKey = props.idempotencyKey;
    this._failureReason = props.failureReason;
  }

  static factory(props: PaymentProps): Payment {
    return new Payment(props);
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
