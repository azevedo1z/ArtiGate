import { Injectable, Logger } from '@nestjs/common';
import { PaymentWebhookDTO } from '../../dtos/payment/paymentWebhook.dto';
import { UpdatePaymentPersistDTO } from '../../dtos/payment/paymentPersist.dto';
import { PaymentDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { PaymentGatewayAdapter } from '../../../interface/adapter/paymentGateway.adapter';
import { PaymentGatewayWebhookHeaders } from '../../dtos/payment/paymentGatewayCharge.dto';
import { PaymentStatus } from '../../../shared/types/payment.types';

const STATUS_PRIORITY: Record<PaymentStatus, number> = {
  pending: 0,
  in_process: 1,
  authorized: 2,
  approved: 3,
  cancelled: 4,
  rejected: 4,
  refunded: 5,
  charged_back: 5,
};

@Injectable()
export class ProcessPaymentWebhookService {
  private readonly logger = new Logger(ProcessPaymentWebhookService.name);

  constructor(
    private readonly adapter: PaymentDatabaseAdapter,
    private readonly gateway: PaymentGatewayAdapter
  ) {}

  async execute(
    headers: PaymentGatewayWebhookHeaders,
    body: PaymentWebhookDTO
  ): Promise<void> {
    const resourceId = body?.data?.id;
    if (!resourceId) {
      this.logger.warn(
        'Payment webhook received without resource id; ignoring.'
      );
      return;
    }

    if (!this.gateway.verifyWebhookSignature(headers, resourceId)) {
      this.logger.warn(
        `Payment webhook signature verification failed for resource ${resourceId}; ignoring.`
      );
      return;
    }

    if (body.type && body.type !== 'payment') {
      this.logger.debug(
        `Ignoring webhook of type "${body.type}" (only "payment" is processed).`
      );
      return;
    }

    const remote = await this.gateway.fetchPaymentStatus(resourceId);
    if (!remote) {
      this.logger.warn(
        `Payment webhook: gateway lookup returned nothing for ${resourceId}.`
      );
      return;
    }

    const existing = await this.adapter.findByGatewayPaymentId?.(resourceId);
    if (!existing) {
      this.logger.warn(
        `Payment webhook for unknown gatewayPaymentId=${resourceId}; ignoring.`
      );
      return;
    }

    if (!this.shouldApply(existing.status, remote.status)) {
      this.logger.warn(
        `Payment webhook would regress status (${existing.status} -> ${remote.status}); ignoring.`
      );
      return;
    }

    const update = new UpdatePaymentPersistDTO({
      id: existing.id,
      status: remote.status,
      paymentMethodId: remote.paymentMethodId,
      failureReason: remote.failureReason,
      rawGatewayResponse: remote.rawResponse,
    });

    await this.adapter.update(update);
  }

  private shouldApply(currentStatus: string, nextStatus: string): boolean {
    const current = STATUS_PRIORITY[currentStatus as PaymentStatus];
    const next = STATUS_PRIORITY[nextStatus as PaymentStatus];

    if (current == null || next == null) {
      this.logger.warn(
        `Payment webhook: refusing unknown status transition (${currentStatus} -> ${nextStatus}).`
      );
      return false;
    }
    return next >= current;
  }
}
