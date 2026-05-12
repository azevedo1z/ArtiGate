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
    const token = this.extractBearerToken(request.headers['authorization']);
    const secretKey = this.configService.get<string>('jwt.secret');

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token, {
        secret: secretKey,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired access token.');
    }

    if (!payload?.sub)
      throw new UnauthorizedException('Invalid access token payload.');

    request.user = { id: payload.sub };

    return true;
  }

  private extractBearerToken(authHeader: string | string[] | undefined): string {
    const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    if (!header)
      throw new UnauthorizedException(
        'Missing or badly formatted Bearer token.'
      );

    const [scheme, ...rest] = header.trim().split(/\s+/);
    const token = rest.join(' ').trim();

    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token)
      throw new UnauthorizedException(
        'Missing or badly formatted Bearer token.'
      );

    return token;
  }
}
