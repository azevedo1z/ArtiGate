import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class CreateAddressDTO {
  @ApiProperty()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'ZIP code must be in format XXXXX-XXX or XXXXXXXX'
  })
  zipCode: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  street: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  complement?: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  neighborhood: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  state: string;

  constructor(
    zipCode: string,
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    complement?: string
  ) {
    this.zipCode = zipCode;
    this.street = street;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.complement = complement;
  }
}
