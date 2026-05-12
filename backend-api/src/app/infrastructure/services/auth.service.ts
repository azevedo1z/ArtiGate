import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDTO } from '../../application/dtos/user/authUser.dto';
import { UnauthorizedException } from '../../shared/exceptions/app.exception';
import { UserDatabaseAdapter } from '../../interface/adapter/database.adapter';

// Pre-computed bcrypt hash used to keep "no such user" responses on the same
// CPU cost as "wrong password" responses. Prevents user-enumeration by timing.
// The plaintext is irrelevant — we only need a valid hash to feed bcrypt.compare.
const DUMMY_BCRYPT_HASH =
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8u8/N/8gfV37vJxLE0Lqz9XKZ3iuRu';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserDatabaseAdapter,
    private readonly jwtService: JwtService
  ) {}

  async signIn(data: AuthUserDTO): Promise<{ access_token: string }> {
    const existingUser = await this.userRepository.findByEmail?.(data.email);

    const passwordHash = existingUser?.passwordHash ?? DUMMY_BCRYPT_HASH;
    const isPasswordValid = await bcrypt.compare(data.password, passwordHash);

    if (!existingUser || !isPasswordValid)
      throw new UnauthorizedException('Invalid credentials.');

    const payload = { sub: existingUser.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
