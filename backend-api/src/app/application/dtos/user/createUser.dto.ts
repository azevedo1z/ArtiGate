import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsArray, ArrayNotEmpty, IsUrl, Matches } from 'class-validator';
import { CreateAddressDTO } from '../address/createAddress.dto';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/, {
    message: 'Phone must be in format +X-XXX-XXX-XXXX (international)'
  })
  phone: string;

  @ApiProperty()
  @IsUrl()
  @MaxLength(500)
  badgeUrl: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  roleIds: string[];

  @ApiProperty()
  homeAddress: CreateAddressDTO;

  @ApiProperty()
  jobAddress: CreateAddressDTO;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  password: string;

  constructor(
    name: string,
    email: string,
    phone: string,
    badgeUrl: string,
    homeAddress: CreateAddressDTO,
    jobAddress: CreateAddressDTO,
    roleIds: string[],
    password: string
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.badgeUrl = badgeUrl;
    this.homeAddress = homeAddress;
    this.jobAddress = jobAddress;
    this.roleIds = roleIds;
    this.password = password;
  }
}
