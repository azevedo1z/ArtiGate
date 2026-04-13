import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthUserDTO {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
