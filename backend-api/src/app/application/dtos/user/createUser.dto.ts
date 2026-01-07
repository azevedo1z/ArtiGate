import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDTO } from '../address/createAddress.dto';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  badgeUrl: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  roleIds: string[];

  @ApiProperty({ type: CreateAddressDTO })
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  homeAddress: CreateAddressDTO;

  @ApiProperty({ type: CreateAddressDTO })
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  jobAddress: CreateAddressDTO;

  @ApiProperty()
  @IsString()
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
