import { Injectable } from '@nestjs/common';
import { GetUserService } from '../application/services/user/getUser.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

    if (existingUser == null) throw new Error('User not found.');

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!isPasswordValid) throw new Error('Invalid password.');

    const payload = { sub: existingUser.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
