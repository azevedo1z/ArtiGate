import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentGatewayAdapter } from '../../interface/adapter/paymentGateway.adapter';
import {
  PaymentGatewayChargeRequestDTO,
  PaymentGatewayChargeResultDTO,
} from '../../application/dtos/payment/paymentGatewayCharge.dto';

@Injectable()
export class MockPaymentGatewayService extends PaymentGatewayAdapter {
  private readonly logger = new Logger(MockPaymentGatewayService.name);

  async createCharge(
    request: PaymentGatewayChargeRequestDTO
  ): Promise<PaymentGatewayChargeResultDTO> {
    this.logger.warn(
      `ENABLE_PAYMENT_MOCK is on. Returning a synthetic approval (idempotencyKey=${request.idempotencyKey}).`
    );

    return new PaymentGatewayChargeResultDTO({
      gatewayPaymentId: `mock-${randomUUID()}`,
      status: 'approved',
      paymentMethodId: request.paymentMethodId,
      failureReason: null,
      rawResponse: JSON.stringify({
        mock: true,
        amount: request.amount,
        currency: request.currency,
        idempotencyKey: request.idempotencyKey,
      }),
    });
  }

  verifyWebhookSignature(): boolean {
    this.logger.warn(
      'ENABLE_PAYMENT_MOCK is on. Skipping webhook signature verification.'
    );
    return true;
  }

  async fetchPaymentStatus(
    gatewayPaymentId: string
  ): Promise<PaymentGatewayChargeResultDTO | null> {
    return new PaymentGatewayChargeResultDTO({
      gatewayPaymentId,
      status: 'approved',
      paymentMethodId: 'mock',
      failureReason: null,
      rawResponse: JSON.stringify({ mock: true, id: gatewayPaymentId }),
    });
  }
}
