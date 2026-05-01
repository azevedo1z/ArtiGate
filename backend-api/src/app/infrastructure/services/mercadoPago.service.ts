import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { MercadoPagoConfig, Payment as MercadoPagoPayment } from 'mercadopago';
import { PaymentGatewayException } from '../../shared/exceptions/app.exception';
import { PaymentStatus } from '../../shared/types/payment.types';
import { PaymentGatewayAdapter } from '../../interface/adapter/paymentGateway.adapter';
import {
  PaymentGatewayChargeRequestDTO,
  PaymentGatewayChargeResultDTO,
  PaymentGatewayWebhookHeaders,
} from '../../application/dtos/payment/paymentGatewayCharge.dto';
import { PAYMENT_STATUS_OPTIONS } from '../../shared/constants';

const REQUEST_TIMEOUT_MS = 10_000;

@Injectable()
export class MercadoPagoService extends PaymentGatewayAdapter {
  private readonly logger = new Logger(MercadoPagoService.name);
  private readonly client: MercadoPagoConfig;
  private readonly paymentClient: MercadoPagoPayment;
  private readonly webhookSecret: string;
  private readonly notificationUrl: string;

  constructor(private readonly configService: ConfigService) {
    super();
    const accessToken = this.configService.getOrThrow<string>(
      'payment.mercadoPago.accessToken'
    );
    this.webhookSecret = this.configService.getOrThrow<string>(
      'payment.mercadoPago.webhookSecret'
    );
    this.notificationUrl = this.configService.getOrThrow<string>(
      'payment.mercadoPago.notificationUrl'
    );
    this.client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: REQUEST_TIMEOUT_MS },
    });
    this.paymentClient = new MercadoPagoPayment(this.client);
  }

  async createCharge(
    request: PaymentGatewayChargeRequestDTO
  ): Promise<PaymentGatewayChargeResultDTO> {
    try {
      const response = await this.paymentClient.create({
        body: {
          transaction_amount: request.amount,
          description: request.description ?? undefined,
          payment_method_id: request.paymentMethodId,
          installments: 1,
          token: request.token ?? undefined,
          external_reference: request.idempotencyKey,
          notification_url: this.notificationUrl,
          statement_descriptor: 'ARTIGATE',
          payer: {
            email: request.payerEmail,
            ...(request.payerIdentificationType &&
              request.payerIdentificationNumber && {
                identification: {
                  type: request.payerIdentificationType,
                  number: request.payerIdentificationNumber,
                },
              }),
          },
        },
        requestOptions: {
          idempotencyKey: request.idempotencyKey,
          timeout: REQUEST_TIMEOUT_MS,
        },
      });

      return new PaymentGatewayChargeResultDTO({
        gatewayPaymentId: response.id != null ? String(response.id) : '',
        status: this.mapStatus(response.status),
        paymentMethodId: response.payment_method_id ?? null,
        failureReason: response.status_detail ?? null,
        rawResponse: JSON.stringify(this.sanitizeResponse(response)),
      });
    } catch (error) {
      this.logger.error(
        `Mercado Pago charge failed (idempotencyKey=${request.idempotencyKey})`,
        error instanceof Error ? error.stack : JSON.stringify(error)
      );
      throw new PaymentGatewayException(
        'Payment could not be processed. Please try again later.'
      );
    }
  }

  verifyWebhookSignature(
    headers: PaymentGatewayWebhookHeaders,
    resourceId: string
  ): boolean {
    const signatureHeader = this.getHeader(headers, 'x-signature');
    const requestId = this.getHeader(headers, 'x-request-id');

    if (!signatureHeader || !requestId || !resourceId) return false;

    let ts = '';
    let v1 = '';
    for (const part of signatureHeader.split(',')) {
      const [rawKey, rawValue] = part.trim().split('=');
      const key = rawKey?.trim();
      const value = rawValue?.trim();
      if (!key || !value) continue;
      if (key === 'ts') ts = value;
      else if (key === 'v1') v1 = value;
    }

    if (!ts || !v1) return false;

    const manifest = `id:${resourceId};request-id:${requestId};ts:${ts};`;
    const expected = createHmac('sha256', this.webhookSecret)
      .update(manifest)
      .digest('hex');

    const expectedBuffer = Buffer.from(expected, 'utf8');
    const receivedBuffer = Buffer.from(v1, 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length) return false;

    try {
      return timingSafeEqual(
        Uint8Array.from(expectedBuffer),
        Uint8Array.from(receivedBuffer)
      );
    } catch {
      return false;
    }
  }

  async fetchPaymentStatus(
    gatewayPaymentId: string
  ): Promise<PaymentGatewayChargeResultDTO | null> {
    try {
      const response = await this.paymentClient.get({ id: gatewayPaymentId });
      return new PaymentGatewayChargeResultDTO({
        gatewayPaymentId:
          response.id != null ? String(response.id) : gatewayPaymentId,
        status: this.mapStatus(response.status),
        paymentMethodId: response.payment_method_id ?? null,
        failureReason: response.status_detail ?? null,
        rawResponse: JSON.stringify(this.sanitizeResponse(response)),
      });
    } catch (error) {
      this.logger.error(
        `Mercado Pago lookup failed for paymentId=${gatewayPaymentId}`,
        error instanceof Error ? error.stack : JSON.stringify(error)
      );
      return null;
    }
  }

  private mapStatus(status?: string): PaymentStatus {
    if (!status) return 'pending';
    if (
      (
        PAYMENT_STATUS_OPTIONS.map((o) => o.value) as readonly string[]
      ).includes(status)
    ) {
      return status as PaymentStatus;
    }
    if (status === 'in_mediation') return 'in_process';
    return 'pending';
  }

  private getHeader(
    headers: PaymentGatewayWebhookHeaders,
    name: string
  ): string | undefined {
    const raw = headers[name] ?? headers[name.toLowerCase()];
    return Array.isArray(raw) ? raw[0] : raw;
  }

  private sanitizeResponse(response: unknown): unknown {
    try {
      const clone = JSON.parse(JSON.stringify(response)) as Record<
        string,
        unknown
      >;
      const card = clone['card'] as Record<string, unknown> | undefined;
      if (card) {
        delete card['cardholder'];
        delete card['security_code_length'];
      }
      delete clone['payer_authentication'];
      return clone;
    } catch {
      return { sanitized: false };
    }
  }
}
