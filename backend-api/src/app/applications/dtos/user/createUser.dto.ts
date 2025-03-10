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
  homeAddress: CreateAddressDTO;

  @ApiProperty()
  jobAddress: CreateAddressDTO;

  @ApiProperty()
  badgeUrl: string;

  // @ApiProperty()
  // _userRoles: UserRoleDTO[];

  constructor(
    name: string,
    email: string,
    phone: string,
    badgeUrl: string,
    homeAddress: CreateAddressDTO,
    jobAddress: CreateAddressDTO
    // userRoles: UserRoleDTO[]
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.badgeUrl = badgeUrl;
    this.homeAddress = homeAddress;
    this.jobAddress = jobAddress;
    // this._userRoles = userRoles;
  }
}