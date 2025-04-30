import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDTO {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  zipCode: string;

  @ApiProperty({ required: false })
  street: string;

  @ApiProperty({ required: false })
  complement?: string;

  @ApiProperty({ required: false })
  neighborhood: string;

  @ApiProperty({ required: false })
  city: string;

  @ApiProperty({ required: false })
  state: string;

  constructor(
    id: string,
    zipCode: string,
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    complement?: string
  ) {
    this.id = id;
    this.zipCode = zipCode;
    this.street = street;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.complement = complement;
  }
}
