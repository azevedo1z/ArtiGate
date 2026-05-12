import { Injectable, Logger } from '@nestjs/common';
import { PaymentWebhookDTO } from '../../dtos/payment/paymentWebhook.dto';
import { UpdatePaymentPersistDTO } from '../../dtos/payment/paymentPersist.dto';
import { Payment } from '../../../domain/models/payment.model';
import { PaymentDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { PaymentGatewayAdapter } from '../../../interface/adapter/paymentGateway.adapter';
import { PaymentGatewayWebhookHeaders } from '../../dtos/payment/paymentGatewayCharge.dto';
import { PaymentStatus } from '../../../shared/types/payment.types';

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

    if (
      !Payment.canTransitionTo(
        existing.status as PaymentStatus,
        remote.status as PaymentStatus
      )
    ) {
      this.logger.warn(
        `Payment webhook would regress or use unknown status (${existing.status} -> ${remote.status}); ignoring.`
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
}
