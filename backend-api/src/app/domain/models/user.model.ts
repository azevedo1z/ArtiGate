
export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _homeAddressId: string;
  private _jobAddressId: string;
  private _badgeUrl: string;
  // private _userRoles: UserRole[];

  private constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    homeAddressId: string,
    jobAddressId: string,
    badgeUrl: string /*, userRole: UserRole*/
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._homeAddressId = homeAddressId;
    this._jobAddressId = jobAddressId;
    this._badgeUrl = badgeUrl;
    // this._userRoles = UserRole;
  }

  static factory(
    id: string,
    name: string,
    email: string,
    phone: string,
    homeAddressId: string,
    jobAddressId: string,
    badgeUrl: string
  ): User {
    return new User(
      id,
      name,
      email,
      phone,
      homeAddressId,
      jobAddressId,
      badgeUrl
    );
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

  get homeAddress(): string {
    return this._homeAddressId;
  }

  private set homeAddress(value: string) {
    this._homeAddressId = value;
  }

  get jobAddress(): string {
    return this._jobAddressId;
  }

  private set jobAddress(value: string) {
    this._jobAddressId = value;
  }

  get badgeUrl(): string {
    return this._badgeUrl;
  }

  private set badgeUrl(value: string) {
    this._badgeUrl = value;
  }

  // get userRoles(): UserRole[] {
  //   return this._userRoles;
  // }

  // private set userRoles(value: UserRole[]) {
  //   this._userRoles = value;
  // }
}
