import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDTO } from '../address/createAddress.dto';

export class CreateUserDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  badgeUrl: string;

  @ApiProperty()
  roleIds: string[];

  @ApiProperty()
  homeAddress: CreateAddressDTO;

  @ApiProperty()
  jobAddress: CreateAddressDTO;

  constructor(
    name: string,
    email: string,
    phone: string,
    badgeUrl: string,
    homeAddress: CreateAddressDTO,
    jobAddress: CreateAddressDTO,
    roleIds: string[]
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.badgeUrl = badgeUrl;
    this.homeAddress = homeAddress;
    this.jobAddress = jobAddress;
    this.roleIds = roleIds;
  }
}