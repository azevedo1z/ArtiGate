import { Injectable } from '@nestjs/common';
import { GetUserService } from '../../application/services/user/getUser.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDTO } from '../../application/dtos/user/authUser.dto';
import { UnauthorizedException } from '../../shared/exceptions/app.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(data: AuthUserDTO): Promise<{ access_token: string }> {
    const existingUser = await this.getUserService.getByEmail(data.email);

    if (existingUser == null) throw new UnauthorizedException('Invalid credentials.');

    const isPasswordValid = await bcrypt.compare(
      data.password,
      existingUser.passwordHash
    );

    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');

    const payload = { sub: existingUser.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
