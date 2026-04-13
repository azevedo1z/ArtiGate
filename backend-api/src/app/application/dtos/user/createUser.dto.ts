import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, ValidateNested, MinLength, IsUrl } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateAddressDTO } from '../address/createAddress.dto';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  phone: string;

  @ApiProperty()
  @IsUrl()
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
  @MinLength(8)
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
