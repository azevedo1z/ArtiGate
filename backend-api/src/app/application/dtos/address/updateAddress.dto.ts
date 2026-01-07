import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAddressDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  zipCode: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  street: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  neighborhood: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
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
