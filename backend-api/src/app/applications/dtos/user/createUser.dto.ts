import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDTO } from '../address/createAddress.dto';

export class CreateUserDTO {
  @ApiProperty()
  private _name: string;

  @ApiProperty()
  private _email: string;

  @ApiProperty()
  private _phone: string;

  @ApiProperty()
  private _homeAddress: CreateAddressDTO;

  @ApiProperty()
  private _jobAddress: CreateAddressDTO;

  @ApiProperty()
  private _badgeUrl: string;

  // @ApiProperty()
  // private _userRoles: UserRoleDTO[];

  constructor(
    name: string,
    email: string,
    phone: string,
    badgeUrl: string,
    homeAddress: CreateAddressDTO,
    jobAddress: CreateAddressDTO,
    // userRoles: UserRoleDTO[]
  ) {
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._badgeUrl = badgeUrl;
    this._homeAddress = homeAddress;
    this._jobAddress = jobAddress;
    // this._userRoles = userRoles;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }

  get homeAddress(): CreateAddressDTO {
    return this._homeAddress;
  }

  set homeAddress(value: CreateAddressDTO) {
    this._homeAddress = value;
  }

  get jobAddress(): CreateAddressDTO {
    return this._jobAddress;
  }

  set jobAddress(value: CreateAddressDTO) {
    this._jobAddress = value;
  }

  get badgeUrl(): string {
    return this._badgeUrl;
  }

  set badgeUrl(value: string) {
    this._badgeUrl = value;
  }

  // get userRole(): CreateUserRoleDTO[] {
  //   return this._userRoles;
  // }

  // set userRole(value: CreateUserRoleDTO[]) {
  //   this._userRoles = value;
  // }
}