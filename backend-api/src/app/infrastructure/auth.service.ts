import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GetUserService } from '../application/services/user/getUser.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    password: string
  ): Promise<{ access_token: string }> {
    const existingUser = await this.getUserService.getByEmail(email);

    if (existingUser == null)
      throw new UnauthorizedException('User not found.');

    const passwordMatches = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordMatches) throw new UnauthorizedException('Invalid password.');

    const payload = { email: existingUser.email, sub: existingUser.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
