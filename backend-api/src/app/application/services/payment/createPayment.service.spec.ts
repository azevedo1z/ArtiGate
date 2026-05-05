import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { CreatePaymentService } from './createPayment.service';
import { CreatePaymentDTO } from '../../dtos/payment/createPayment.dto';
import {
  PaymentDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { PaymentGatewayAdapter } from '../../../interface/adapter/paymentGateway.adapter';
import {
  ConflictException,
  NotFoundException,
  PaymentGatewayException,
} from '../../../shared/exceptions/app.exception';
import { PAYMENT_ACCESS_FEE } from '../../../shared/constants';

describe('CreatePaymentService', () => {
  let service: CreatePaymentService;
  let paymentAdapter: jest.Mocked<PaymentDatabaseAdapter>;
  let userAdapter: jest.Mocked<UserDatabaseAdapter>;
  let gateway: jest.Mocked<PaymentGatewayAdapter>;
  let configService: jest.Mocked<ConfigService>;

  const userId = '11111111-1111-1111-1111-111111111111';
  const baseDto: CreatePaymentDTO = {
    paymentMethodId: 'visa',
    payerEmail: 'buyer@example.com',
    idempotencyKey: '22222222-2222-2222-2222-222222222222',
    token: 'mp-token-abc',
  };

  const persistedRow = {
    id: 'p-2',
    userId,
    amount: PAYMENT_ACCESS_FEE,
    currency: 'BRL',
    status: 'approved',
    description: null,
    paymentMethodId: 'visa',
    payerEmail: 'buyer@example.com',
    gatewayPaymentId: 'mp-42',
    idempotencyKey: baseDto.idempotencyKey,
    failureReason: null,
    rawGatewayResponse: '{}',
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    paymentAdapter = {
      findByIdempotencyKey: jest.fn(),
      hasApprovedFeeByUserId: jest.fn().mockResolvedValue(false),
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
    (paymentAdapter.findByIdempotencyKey as jest.Mock).mockResolvedValue({
      ...persistedRow,
      id: 'p-1',
      paymentMethodId: 'master',
    } as never);

    const result = await service.execute(userId, baseDto);

    expect(result.id).toBe('p-1');
    expect(gateway.createCharge).not.toHaveBeenCalled();
    expect(paymentAdapter.create).not.toHaveBeenCalled();
  });

  it('throws ConflictException when the user already paid the access fee', async () => {
    userAdapter.findById.mockResolvedValue({ id: userId } as never);
    (paymentAdapter.findByIdempotencyKey as jest.Mock).mockResolvedValue(null);
    (paymentAdapter.hasApprovedFeeByUserId as jest.Mock).mockResolvedValue(
      true
    );

    await expect(service.execute(userId, baseDto)).rejects.toThrow(
      ConflictException
    );
    expect(gateway.createCharge).not.toHaveBeenCalled();
    expect(paymentAdapter.create).not.toHaveBeenCalled();
  });

  it('charges the gateway with the backend-defined amount and persists the payment row', async () => {
    userAdapter.findById.mockResolvedValue({ id: userId } as never);
    (paymentAdapter.findByIdempotencyKey as jest.Mock).mockResolvedValue(null);
    gateway.createCharge.mockResolvedValue({
      gatewayPaymentId: 'mp-42',
      status: 'approved',
      paymentMethodId: 'visa',
      failureReason: null,
      rawResponse: '{}',
    });
    paymentAdapter.create.mockResolvedValue(persistedRow as never);

    const result = await service.execute(userId, baseDto);

    expect(result.id).toBe('p-2');
    expect(result.status).toBe('approved');
    expect(result.amount).toBe(PAYMENT_ACCESS_FEE);
    expect(gateway.createCharge).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'mp-token-abc',
        amount: PAYMENT_ACCESS_FEE,
        currency: 'BRL',
        idempotencyKey: baseDto.idempotencyKey,
      })
    );
    const persistedCall = paymentAdapter.create.mock.calls[0][0];
    expect(persistedCall).toEqual(
      expect.objectContaining({
        userId,
        currency: 'BRL',
        status: 'approved',
        paymentMethodId: 'visa',
        gatewayPaymentId: 'mp-42',
        idempotencyKey: baseDto.idempotencyKey,
      })
    );
    expect(Number(persistedCall.amount)).toBe(PAYMENT_ACCESS_FEE);
  });

  it('returns the existing row when the persist call hits a unique-constraint violation', async () => {
    userAdapter.findById.mockResolvedValue({ id: userId } as never);
    const findByKey = paymentAdapter.findByIdempotencyKey as jest.Mock;
    findByKey.mockResolvedValueOnce(null).mockResolvedValueOnce({
      ...persistedRow,
      id: 'p-recovered',
    });
    gateway.createCharge.mockResolvedValue({
      gatewayPaymentId: 'mp-42',
      status: 'approved',
      paymentMethodId: 'visa',
      failureReason: null,
      rawResponse: '{}',
    });
    const uniqueViolation = new Prisma.PrismaClientKnownRequestError(
      'duplicate',
      { code: 'P2002', clientVersion: 'test' }
    );
    paymentAdapter.create.mockRejectedValue(uniqueViolation);

    const result = await service.execute(userId, baseDto);

    expect(result.id).toBe('p-recovered');
    expect(findByKey).toHaveBeenCalledTimes(2);
  });

  it('throws PaymentGatewayException when persist fails for a non-unique reason', async () => {
    userAdapter.findById.mockResolvedValue({ id: userId } as never);
    (paymentAdapter.findByIdempotencyKey as jest.Mock).mockResolvedValue(null);
    gateway.createCharge.mockResolvedValue({
      gatewayPaymentId: 'mp-42',
      status: 'approved',
      paymentMethodId: 'visa',
      failureReason: null,
      rawResponse: '{}',
    });
    paymentAdapter.create.mockRejectedValue(new Error('database is down'));

    await expect(service.execute(userId, baseDto)).rejects.toThrow(
      PaymentGatewayException
    );
  });
});
