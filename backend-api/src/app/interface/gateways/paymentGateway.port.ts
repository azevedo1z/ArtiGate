import {
  PaymentGatewayChargeRequestDTO,
  PaymentGatewayChargeResultDTO,
  PaymentGatewayWebhookHeaders,
} from '../../application/dtos/payment/paymentGatewayCharge.dto';

export abstract class PaymentGatewayAdapter {
  abstract createCharge(
    request: PaymentGatewayChargeRequestDTO
  ): Promise<PaymentGatewayChargeResultDTO>;

  abstract verifyWebhookSignature(
    headers: PaymentGatewayWebhookHeaders,
    resourceId: string
  ): boolean;

  abstract fetchPaymentStatus(
    gatewayPaymentId: string
  ): Promise<PaymentGatewayChargeResultDTO | null>;
}
