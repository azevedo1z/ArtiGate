import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from '../../shared/types/auth.types';

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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

    try {
      const secretKey = process.env.SECRET_KEY;

      const payload: JwtPayload = await this.jwtService.verify(token, {
        secret: secretKey,
      });

      request.user = { id: payload.sub };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
