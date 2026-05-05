import { PAYMENT_STATUS_OPTIONS } from '../constants';

export type PaymentStatus = (typeof PAYMENT_STATUS_OPTIONS)[number]['value'];

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
