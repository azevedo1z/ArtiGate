import { BadRequestException, Injectable } from '@nestjs/common';
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
    const existingUser = await this.getUserService.getByEmail(data.email);

    if (existingUser == null) throw new BadRequestException('User not found.');

    const isPasswordValid = await bcrypt.compare(
      data.password,
      existingUser.passwordHash
    );

    if (!isPasswordValid) throw new BadRequestException('Invalid password.');

    const payload = { sub: existingUser.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
