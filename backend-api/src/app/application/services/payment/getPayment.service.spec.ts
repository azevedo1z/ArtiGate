import { GetPaymentService } from './getPayment.service';
import { PaymentRepository } from '../../../interface/repositories/payment.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

describe('GetPaymentService', () => {
  let service: GetPaymentService;
  let adapter: jest.Mocked<PaymentRepository>;

  const ownerId = '11111111-1111-1111-1111-111111111111';
  const otherUserId = '99999999-9999-9999-9999-999999999999';

  const row = {
    id: 'p-1',
    userId: ownerId,
    amount: 49.9,
    currency: 'BRL',
    status: 'approved',
    description: null,
    paymentMethodId: 'visa',
    payerEmail: 'buyer@example.com',
    gatewayPaymentId: 'mp-1',
    idempotencyKey: '22222222-2222-2222-2222-222222222222',
    failureReason: null,
    rawGatewayResponse: null,
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    adapter = {
      findById: jest.fn(),
      findManyByUserId: jest.fn(),
    } as never;
    service = new GetPaymentService(adapter);
  });

  describe('getById', () => {
    it('returns the payment when the requester owns it', async () => {
      adapter.findById.mockResolvedValue(row as never);

      const result = await service.getById('p-1', ownerId);

      expect(result.id).toBe('p-1');
      expect(result.userId).toBe(ownerId);
    });

    it('throws NotFoundException when the payment does not exist', async () => {
      adapter.findById.mockResolvedValue(null);

      await expect(service.getById('p-1', ownerId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('throws NotFoundException (not Forbidden) when another user requests the payment', async () => {
      // Returning NotFound rather than Forbidden prevents callers from probing
      // the existence of payments belonging to other users.
      adapter.findById.mockResolvedValue(row as never);

      await expect(service.getById('p-1', otherUserId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getByUserId', () => {
    it('returns an empty array when the adapter returns no rows', async () => {
      (adapter.findManyByUserId as jest.Mock).mockResolvedValue([]);
      const result = await service.getByUserId(ownerId);
      expect(result).toEqual([]);
    });

    it('returns the mapped payments for the user', async () => {
      (adapter.findManyByUserId as jest.Mock).mockResolvedValue([row]);
      const result = await service.getByUserId(ownerId);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('p-1');
    });
  });
});
