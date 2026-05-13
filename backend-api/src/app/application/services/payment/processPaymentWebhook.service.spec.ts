import { ProcessPaymentWebhookService } from './processPaymentWebhook.service';
import { PaymentRepository } from '../../../interface/repositories/payment.repository.port';
import { PaymentGatewayAdapter } from '../../../interface/gateways/paymentGateway.port';
import { PaymentGatewayChargeResultDTO } from '../../dtos/payment/paymentGatewayCharge.dto';

const buildHeaders = (): Record<string, string> => ({
  'x-signature': 'ts=1,v1=hash',
  'x-request-id': 'req-1',
});

const buildRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'p-1',
  userId: 'u-1',
  amount: 49.9,
  currency: 'BRL',
  status: 'pending',
  description: null,
  paymentMethodId: 'visa',
  payerEmail: 'buyer@example.com',
  gatewayPaymentId: 'mp-1',
  idempotencyKey: 'idem-1',
  failureReason: null,
  rawGatewayResponse: null,
  createdOn: new Date(),
  updatedOn: new Date(),
  deletedOn: null,
  ...overrides,
});

const buildRemote = (
  status: PaymentGatewayChargeResultDTO['status']
): PaymentGatewayChargeResultDTO =>
  new PaymentGatewayChargeResultDTO({
    gatewayPaymentId: 'mp-1',
    status,
    paymentMethodId: 'visa',
    failureReason: null,
    rawResponse: '{}',
  });

describe('ProcessPaymentWebhookService', () => {
  let service: ProcessPaymentWebhookService;
  let adapter: jest.Mocked<PaymentRepository>;
  let gateway: jest.Mocked<PaymentGatewayAdapter>;

  beforeEach(() => {
    adapter = {
      findByGatewayPaymentId: jest.fn(),
      update: jest.fn(),
    } as never;

    gateway = {
      verifyWebhookSignature: jest.fn(),
      fetchPaymentStatus: jest.fn(),
    } as never;

    service = new ProcessPaymentWebhookService(adapter, gateway);
  });

  it('ignores webhooks without a resource id', async () => {
    await service.execute(buildHeaders(), { data: undefined } as never);
    expect(gateway.verifyWebhookSignature).not.toHaveBeenCalled();
    expect(adapter.update).not.toHaveBeenCalled();
  });

  it('returns silently (does not throw) on invalid signature', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(false);

    await expect(
      service.execute(buildHeaders(), { data: { id: 'mp-1' } } as never)
    ).resolves.toBeUndefined();

    expect(gateway.fetchPaymentStatus).not.toHaveBeenCalled();
    expect(adapter.update).not.toHaveBeenCalled();
  });

  it('skips non-payment webhook types', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(true);

    await service.execute(buildHeaders(), {
      type: 'merchant_order',
      data: { id: 'mp-1' },
    } as never);

    expect(gateway.fetchPaymentStatus).not.toHaveBeenCalled();
  });

  it('updates the existing row when the gateway returns a fresher status', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(true);
    gateway.fetchPaymentStatus.mockResolvedValue(buildRemote('approved'));
    (adapter.findByGatewayPaymentId as jest.Mock).mockResolvedValue(
      buildRow({ status: 'pending' })
    );

    await service.execute(buildHeaders(), { data: { id: 'mp-1' } } as never);

    expect(adapter.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p-1', status: 'approved' })
    );
  });

  it('does not regress an approved payment back to pending', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(true);
    gateway.fetchPaymentStatus.mockResolvedValue(buildRemote('pending'));
    (adapter.findByGatewayPaymentId as jest.Mock).mockResolvedValue(
      buildRow({ status: 'approved' })
    );

    await service.execute(buildHeaders(), { data: { id: 'mp-1' } } as never);

    expect(adapter.update).not.toHaveBeenCalled();
  });

  it('ignores webhooks for unknown gateway payment ids', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(true);
    gateway.fetchPaymentStatus.mockResolvedValue(buildRemote('approved'));
    (adapter.findByGatewayPaymentId as jest.Mock).mockResolvedValue(null);

    await service.execute(buildHeaders(), { data: { id: 'mp-1' } } as never);

    expect(adapter.update).not.toHaveBeenCalled();
  });
});
