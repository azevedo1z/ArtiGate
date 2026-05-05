import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PaymentDatabaseAdapter } from '../../interface/adapter/database.adapter';
import {
  PaymentRequiredException,
  UnauthorizedException,
} from '../../shared/exceptions/app.exception';
import { AuthenticatedRequest } from '../../shared/types/auth.types';

@Injectable()
export class AccessFeePaymentGuard implements CanActivate {
  constructor(private readonly paymentAdapter: PaymentDatabaseAdapter) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId)
      throw new UnauthorizedException(
        'Authenticated user is required to verify the access fee.'
      );

    const hasPaid =
      (await this.paymentAdapter.hasApprovedFeeByUserId?.(userId)) ?? false;

    if (!hasPaid)
      throw new PaymentRequiredException(
        'You must pay the access fee before performing this action.'
      );

    return true;
  }
}
