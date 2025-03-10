import { Address } from "./address.model";
// import { UserRole } from "./userRole.model";

export class User {

  private _id: string;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _homeAddress: Address;
  private _jobAddress: Address;
  // private _userRoles: UserRole[];

  constructor(id: string, name: string, email: string, phone: string, homeAddress: Address,
    jobAddress: Address/*, userRole: UserRole*/) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._homeAddress = homeAddress;
    this._jobAddress = jobAddress;
    // this._userRoles = UserRole;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  private set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  private set email(value: string) {
    this._email = value;
  }

  get phone(): string {
    return this._phone;
  }

  private set phone(value: string) {
    this._phone = value;
  }

  get homeAddress(): Address {
    return this._homeAddress;
  }

  private set homeAddress(value: Address) {
    this._homeAddress = value;
  }

  get jobAddress(): Address {
    return this._jobAddress;
  }

  private set jobAddress(value: Address) {
    this._jobAddress = value;
  }

  // get userRoles(): UserRole[] {
  //   return this._userRoles;
  // }

  // private set userRoles(value: UserRole[]) {
  //   this._userRoles = value;
  // }
}
