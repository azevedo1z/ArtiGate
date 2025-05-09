import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDTO } from '../address/createAddress.dto';

export class UpdateUserDTO {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ required: false })
  badgeUrl: string;

  @ApiProperty({ required: false })
  roleIds: string[];

  @ApiProperty({ required: false })
  homeAddress: CreateAddressDTO;

  @ApiProperty({ required: false })
  jobAddress: CreateAddressDTO;

  @ApiProperty({ required: false })
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
