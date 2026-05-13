import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PaymentRepository } from '../../interface/repositories/payment.repository.port';
import {
  PaymentRequiredException,
  UnauthorizedException,
} from '../../shared/exceptions/app.exception';
import { AuthenticatedRequest } from '../../shared/types/auth.types';

@Injectable()
export class AccessFeePaymentGuard implements CanActivate {
  constructor(private readonly paymentRepo: PaymentRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId)
      throw new UnauthorizedException(
        'Authenticated user is required to verify the access fee.'
      );

    const hasPaid = await this.paymentRepo.hasApprovedFeeByUserId(userId);

    if (!hasPaid)
      throw new PaymentRequiredException(
        'You must pay the access fee before performing this action.'
      );

    return true;
  }
}
