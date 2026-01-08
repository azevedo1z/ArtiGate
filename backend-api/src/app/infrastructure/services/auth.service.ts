import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDTO } from '../../application/dtos/user/authUser.dto';
import { UnauthorizedException } from '../../shared/exceptions/app.exception';
import { UserDatabaseAdapter } from '../../interface/adapter/database.adapter';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserDatabaseAdapter,
    private readonly jwtService: JwtService
  ) {}

  async signIn(data: AuthUserDTO): Promise<{ access_token: string }> {
    const existingUser = await this.userRepository.findByEmail?.(data.email);

    if (existingUser == null)
      throw new UnauthorizedException('Invalid credentials.');

    const isPasswordValid = await bcrypt.compare(
      data.password,
      existingUser.passwordHash
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials.');

    const payload = { sub: existingUser.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
