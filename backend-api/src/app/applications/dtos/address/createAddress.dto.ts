import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDTO {

@ApiProperty()
zipCode: string;

@ApiProperty()
street: string;

@ApiProperty({required: false})
complement?: string;

@ApiProperty()
neighborhood: string;

@ApiProperty()
city: string;

@ApiProperty()
state: string;

constructor(
    zipCode: string,
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    complement?: string
)
{
    this.zipCode = zipCode;
    this.street = street;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.complement = complement;
}
}