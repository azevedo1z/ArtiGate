import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDTO {
  @ApiProperty()
  private _zipCode: string;

  @ApiProperty()
  private _street: string;

  @ApiProperty({ required: false })
  private _complement?: string;

  @ApiProperty()
  private _neighborhood: string;

  @ApiProperty()
  private _city: string;

  @ApiProperty()
  private _state: string;

  constructor(
    zipCode: string,
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    complement?: string
  ) {
    this._zipCode = zipCode;
    this._street = street;
    this._neighborhood = neighborhood;
    this._city = city;
    this._state = state;
    this._complement = complement;
  }
  public get zipCode(): string {
    return this._zipCode;
  }

  public set zipCode(value: string) {
    this._zipCode = value;
  }

  public get street(): string {
    return this._street;
  }

  public set street(value: string) {
    this._street = value;
  }

  public get complement(): string | undefined {
    return this._complement;
  }

  public set complement(value: string | undefined) {
    this._complement = value;
  }

  public get neighborhood(): string {
    return this._neighborhood;
  }

  public set neighborhood(value: string) {
    this._neighborhood = value;
  }

  public get city(): string {
    return this._city;
  }

  public set city(value: string) {
    this._city = value;
  }

  public get state(): string {
    return this._state;
  }

  public set state(value: string) {
    this._state = value;
  }
}