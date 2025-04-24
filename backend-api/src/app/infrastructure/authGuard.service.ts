import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }

  private async validateRequest(request: Request): Promise<boolean> {
    const authHeader = request.headers['authorization'];

    if (authHeader == null) throw new Error('AuthHeader is empty.');

    const token = authHeader.split(' ')[1];

    try {
      const secretKey = process.env.SECRET_KEY;

      await this.jwtService.verify(token, { secret: secretKey });

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
