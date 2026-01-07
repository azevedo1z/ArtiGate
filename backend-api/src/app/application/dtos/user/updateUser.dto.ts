import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDTO } from '../address/createAddress.dto';

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  badgeUrl: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleIds: string[];

  @ApiProperty({ type: CreateAddressDTO, required: false })
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  @IsOptional()
  homeAddress: CreateAddressDTO;

  @ApiProperty({ type: CreateAddressDTO, required: false })
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  @IsOptional()
  jobAddress: CreateAddressDTO;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password: string;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    badgeUrl: string,
    homeAddress: CreateAddressDTO,
    jobAddress: CreateAddressDTO,
    roleIds: string[],
    password: string
  ) {
    this.id = id;
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
