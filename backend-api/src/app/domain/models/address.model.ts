import { ValidationException } from '../../shared/exceptions/app.exception';

export interface AddressProps {
  id: string;
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country?: string;
  complement?: string | null;
}

export class Address {
  static readonly COUNTRY = 'Brazil';

  private _id: string;
  private _zipCode: string;
  private _street: string;
  private _complement?: string;
  private _neighborhood: string;
  private _city: string;
  private _state: string;
  private _country: string;

  private constructor(props: AddressProps) {
    Address.ensureInvariants(props);

    this._id = props.id;
    this._zipCode = props.zipCode;
    this._street = props.street;
    this._neighborhood = props.neighborhood;
    this._city = props.city;
    this._state = props.state;
    this._country = props.country ?? Address.COUNTRY;
    this._complement = props.complement ?? undefined;
  }

  static factory(props: AddressProps): Address {
    return new Address(props);
  }

  private static ensureInvariants(props: AddressProps): void {
    const errors: string[] = [];

    if (!props.street?.trim()) errors.push('Address street is required.');

    if (!props.neighborhood?.trim())
      errors.push('Address neighborhood is required.');

    if (!props.city?.trim()) errors.push('Address city is required.');

    if (!props.state?.trim()) errors.push('Address state is required.');

    if (errors.length) throw new ValidationException(errors.join(' '));
  }

  get id(): string {
    return this._id;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get street(): string {
    return this._street;
  }

  get complement(): string | undefined {
    return this._complement;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get country(): string {
    return this._country;
  }
}
