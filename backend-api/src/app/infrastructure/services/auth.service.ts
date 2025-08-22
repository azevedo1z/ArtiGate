import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GetUserService } from '../../application/services/user/getUser.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDTO } from '../../application/dtos/user/authUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(data: AuthUserDTO): Promise<{ access_token: string }> {
    try {
      const existingUser = await this.getUserService.getByEmail(data.email);

      if (existingUser == null) {
        await this.artificialDelay();
        throw new UnauthorizedException('Invalid credentials.');
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        existingUser.passwordHash
      );

      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials.');

      const payload = {
        sub: existingUser.id,
        email: existingUser.email,
        iat: Math.floor(Date.now() / 1000),
      };

      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new BadRequestException('Authentication failed.');
    }
  }

  private async artificialDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}
