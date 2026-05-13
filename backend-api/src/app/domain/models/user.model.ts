import { EMAIL_REGEX } from '../../shared/constants';
import { ValidationException } from '../../shared/exceptions/app.exception';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  homeAddressId: string;
  jobAddressId: string;
  badgeUrl: string;
  passwordHash: string;
}

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _homeAddressId: string;
  private _jobAddressId: string;
  private _badgeUrl: string;
  private _passwordHash: string;

  private constructor(props: UserProps) {
    User.ensureInvariants(props);

    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._homeAddressId = props.homeAddressId;
    this._jobAddressId = props.jobAddressId;
    this._badgeUrl = props.badgeUrl;
    this._passwordHash = props.passwordHash;
  }

  static factory(props: UserProps): User {
    return new User(props);
  }

  static ensureInvariants(props: UserProps): void {
    const errors: string[] = [];

    if (!props.name?.trim()) errors.push('User name is required.');

    if (!EMAIL_REGEX.test(props.email ?? ''))
      errors.push('User email is invalid.');

    if (!props.phone?.trim()) errors.push('User phone is required.');

    if (errors.length) throw new ValidationException(errors.join(' '));
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get homeAddressId(): string {
    return this._homeAddressId;
  }

  get jobAddressId(): string {
    return this._jobAddressId;
  }

  get badgeUrl(): string {
    return this._badgeUrl;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }
}
