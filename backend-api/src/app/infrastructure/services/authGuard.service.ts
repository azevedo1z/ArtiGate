import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import SecurityConfig from '../../shared/config/security.config';
import { AuthenticatedRequest } from '../../shared/types/auth.types';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuardService implements CanActivate {
  private readonly logger = new Logger(AuthGuardService.name);

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
    try {
      const authHeader = request.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new UnauthorizedException(
          'Missing or invalid authorization header.'
        );

      const token = authHeader.replace('Bearer ', '').trim();

      if (!token) throw new UnauthorizedException('Token is required.');

      if (!SecurityConfig.jwt.secret) {
        this.logger.error('JWT_SECRET not configured');
        throw new UnauthorizedException('Authentication service unavailable.');
      }

      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: SecurityConfig.jwt.secret,
      });

      if (!payload.sub || !payload.email)
        throw new UnauthorizedException('Invalid token payload.');

      request.user = {
        id: payload.sub,
        email: payload.email,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      this.logger.warn(
        `Authentication failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
