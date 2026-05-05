import { Payment as PaymentRow } from '@prisma/client';
import { Payment } from '../../domain/models/payment.model';
import { PaymentStatus } from '../../shared/types/payment.types';

export const paymentRowToDomain = (row: PaymentRow): Payment =>
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
