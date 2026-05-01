import { ConfigService } from '@nestjs/config';
import { CreatePaymentService } from './createPayment.service';
import { CreatePaymentDTO } from '../../dtos/payment/createPayment.dto';
import {
  PaymentDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { PaymentGatewayAdapter } from '../../../interface/adapter/paymentGateway.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

describe('CreatePaymentService', () => {
  let service: CreatePaymentService;
  let paymentAdapter: jest.Mocked<PaymentDatabaseAdapter>;
  let userAdapter: jest.Mocked<UserDatabaseAdapter>;
  let gateway: jest.Mocked<PaymentGatewayAdapter>;
  let configService: jest.Mocked<ConfigService>;

  const userId = '11111111-1111-1111-1111-111111111111';
  const baseDto: CreatePaymentDTO = {
    amount: 49.9,
    paymentMethodId: 'visa',
    payerEmail: 'buyer@example.com',
    idempotencyKey: '22222222-2222-2222-2222-222222222222',
    token: 'mp-token-abc',
  };

  beforeEach(() => {
    paymentAdapter = {
      findByIdempotencyKey: jest.fn(),
      create: jest.fn(),
    } as never;

    userAdapter = {
      findById: jest.fn(),
    } as never;

    gateway = {
      createCharge: jest.fn(),
    } as never;

    configService = {
      get: jest.fn().mockReturnValue('BRL'),
    } as never;

    service = new CreatePaymentService(
      paymentAdapter,
      userAdapter,
      gateway,
      configService
    );
  });

  it('throws NotFoundException when the user does not exist', async () => {
    userAdapter.findById.mockResolvedValue(null);
    await expect(service.execute(userId, baseDto)).rejects.toThrow(
      NotFoundException
    );
    expect(gateway.createCharge).not.toHaveBeenCalled();
  });

  it('returns the cached payment when the idempotency key was already used', async () => {
    userAdapter.findById.mockResolvedValue({ id: userId } as never);
    paymentAdapter.findByIdempotencyKey?.mockResolvedValue({
      id: 'p-1',
      userId,
      amount: 49.9,
      currency: 'BRL',
      status: 'approved',
      description: null,
      paymentMethodId: 'credit',
      payerEmail: 'buyer@example.com',
      gatewayPaymentId: 'mp-1',
      idempotencyKey: baseDto.idempotencyKey,
      failureReason: null,
      rawGatewayResponse: null,
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null,
    } as never);

    const result = await service.execute(userId, baseDto);

    expect(result.id).toBe('p-1');
    expect(gateway.createCharge).not.toHaveBeenCalled();
    expect(paymentAdapter.create).not.toHaveBeenCalled();
  });

  it('charges the gateway and persists the payment row', async () => {
    userAdapter.findById.mockResolvedValue({ id: userId } as never);
    paymentAdapter.findByIdempotencyKey?.mockResolvedValue(null);
    gateway.createCharge.mockResolvedValue({
      gatewayPaymentId: 'mp-42',
      status: 'approved',
      paymentMethodId: 'pix',
      failureReason: null,
      rawResponse: '{}',
    });
    paymentAdapter.create.mockResolvedValue({
      id: 'p-2',
      userId,
      amount: 49.9,
      currency: 'BRL',
      status: 'approved',
      description: null,
      paymentMethodId: 'pix',
      payerEmail: 'buyer@example.com',
      gatewayPaymentId: 'mp-42',
      idempotencyKey: baseDto.idempotencyKey,
      failureReason: null,
      rawGatewayResponse: '{}',
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null,
    } as never);

    const result = await service.execute(userId, baseDto);

    expect(result.id).toBe('p-2');
    expect(result.status).toBe('approved');
    expect(gateway.createCharge).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'mp-token-abc',
        amount: 49.9,
        currency: 'BRL',
        idempotencyKey: baseDto.idempotencyKey,
      })
    );
    expect(paymentAdapter.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        gatewayPaymentId: 'mp-42',
        idempotencyKey: baseDto.idempotencyKey,
      })
    );
  });
});
