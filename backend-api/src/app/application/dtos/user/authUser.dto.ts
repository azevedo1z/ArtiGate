import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
