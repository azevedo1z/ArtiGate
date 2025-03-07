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
  
    constructor(
      id: string,
      zipCode: string,
      street: string,
      neighborhood: string,
      city: string,
      state: string,
      country: string,
      complement?: string
    ) {

      if (country !== Address.COUNTRY) {
        throw new Error('Country must be Brazil.');
      }
  
      this._id = id;
      this._zipCode = zipCode;
      this._street = street;
      this._neighborhood = neighborhood;
      this._city = city;
      this._state = state;
      this._country = country;
      this._complement = complement;
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
  