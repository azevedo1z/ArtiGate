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

  private constructor(
    id: string,
    zipCode: string,
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    country: string = Address.COUNTRY,
    complement?: string
  ) {
    this._id = id;
    this._zipCode = zipCode;
    this._street = street;
    this._neighborhood = neighborhood;
    this._city = city;
    this._state = state;
    this._country = country;
    this._complement = complement;
  }

  static factory(
    id: string,
    zipCode: string,
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    country: string = Address.COUNTRY,
    complement?: string
  ): Address {
    return new Address(
      id,
      zipCode,
      street,
      neighborhood,
      city,
      state,
      country,
      complement
    );
  }

  get id(): string {
    return this._id;
  }

  get zipCode(): string {
    return this._zipCode;
  }
  private set zipCode(value: string) {
    this._zipCode = value;
  }

  get street(): string {
    return this._street;
  }
  private set street(value: string) {
    this._street = value;
  }

  get complement(): string | undefined {
    return this._complement;
  }
  private set complement(value: string | undefined) {
    this._complement = value;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }
  private set neighborhood(value: string) {
    this._neighborhood = value;
  }

  get city(): string {
    return this._city;
  }
  private set city(value: string) {
    this._city = value;
  }

  get state(): string {
    return this._state;
  }
  private set state(value: string) {
    this._state = value;
  }

  get country(): string {
    return this._country;
  }
}
  