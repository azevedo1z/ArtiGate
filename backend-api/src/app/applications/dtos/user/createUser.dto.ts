import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  homeAddressId: string;

  @ApiProperty()
  jobAddressId: string;

  @ApiProperty()
  badgeUrl: string;

  @ApiProperty()
  roleIds: string[];

  constructor(
    name: string,
    email: string,
    phone: string,
    badgeUrl: string,
    homeAddressId: string,
    jobAddressId: string,
    roleIds: string[]
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.badgeUrl = badgeUrl;
    this.homeAddressId = homeAddressId;
    this.jobAddressId = jobAddressId;
    this.roleIds = roleIds;
  }
}