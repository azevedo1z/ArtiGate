export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _homeAddressId: string;
  private _jobAddressId: string;
  private _badgeUrl: string;
  private _passwordHash: string;

  private constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    homeAddressId: string,
    jobAddressId: string,
    badgeUrl: string,
    passwordHash: string
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._homeAddressId = homeAddressId;
    this._jobAddressId = jobAddressId;
    this._badgeUrl = badgeUrl;
    this._passwordHash = passwordHash;
  }

  static factory(
    id: string,
    name: string,
    email: string,
    phone: string,
    homeAddressId: string,
    jobAddressId: string,
    badgeUrl: string,
    passwordHash: string
  ): User {
    return new User(
      id,
      name,
      email,
      phone,
      homeAddressId,
      jobAddressId,
      badgeUrl,
      passwordHash
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

  get homeAddressId(): string {
    return this._homeAddressId;
  }

  private set homeAddressId(value: string) {
    this._homeAddressId = value;
  }

  get jobAddressId(): string {
    return this._jobAddressId;
  }

  private set jobAddressId(value: string) {
    this._jobAddressId = value;
  }

  get badgeUrl(): string {
    return this._badgeUrl;
  }

  private set badgeUrl(value: string) {
    this._badgeUrl = value;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  private set passwordHash(value: string) {
    this._passwordHash = value;
  }
}
