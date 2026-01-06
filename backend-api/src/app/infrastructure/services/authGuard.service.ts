import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from '../../shared/types/auth.types';
import { UnauthorizedException } from '../../shared/exceptions/app.exception';

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }

  private async validateRequest(
    request: AuthenticatedRequest
  ): Promise<boolean> {
    const authHeader = request.headers['authorization'];

    if (authHeader == null)
      throw new UnauthorizedException(
        'Missing or badly formatted Bearer token.'
      );

    const token = authHeader.replace('Bearer ', '').trim();

    const secretKey = this.configService.get<string>('jwt.secret');

    const payload: JwtPayload = await this.jwtService.verify(token, {
      secret: secretKey,
    });

    request.user = { id: payload.sub };

    return true;
  }
}
