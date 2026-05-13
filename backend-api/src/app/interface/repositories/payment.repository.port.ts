import { Payment } from '../../domain/models/payment.model';
import {
  CreatePaymentPersistDTO,
  UpdatePaymentPersistDTO,
} from '../../application/dtos/payment/paymentPersist.dto';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';

export abstract class PaymentRepository {
  abstract create(data: CreatePaymentPersistDTO): Promise<Payment>;
  abstract update(data: UpdatePaymentPersistDTO): Promise<Payment>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Payment | null>;
  abstract findAll(pagination?: PaginationDTO): Promise<Payment[]>;
  abstract countAll(): Promise<number>;
  abstract findManyByUserId(userId: string): Promise<Payment[]>;
  abstract findByIdempotencyKey(key: string): Promise<Payment | null>;
  abstract findByGatewayPaymentId(id: string): Promise<Payment | null>;
  abstract hasApprovedFeeByUserId(userId: string): Promise<boolean>;
}
