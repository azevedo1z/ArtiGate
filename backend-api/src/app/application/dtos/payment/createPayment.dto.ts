import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PAYMENT_METHOD_IDS } from '../../../shared/constants';
import { PayerIdentificationDTO } from './payerIdentification.dto';

export class CreatePaymentDTO {
  @ApiProperty({
    description:
      'Card token returned by the Payment Gateway js client SDK. Optional for non-card methods.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  token?: string;

  @ApiProperty({
    description:
      'ISO 4217 currency code. Defaults to PAYMENT_DEFAULT_CURRENCY when omitted.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value
  )
  currency?: string;

  @ApiProperty({
    description: `Payment method id. Allowed values: ${PAYMENT_METHOD_IDS.join(
      ', '
    )}.`,
  })
  @IsString()
  @IsIn(PAYMENT_METHOD_IDS, {
    message: `paymentMethodId must be one of: ${PAYMENT_METHOD_IDS.join(', ')}.`,
  })
  paymentMethodId!: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(254)
  payerEmail!: string;

  @ApiProperty({ required: false, type: () => PayerIdentificationDTO })
  @IsOptional()
  @ValidateNested()
  @Type(() => PayerIdentificationDTO)
  payerIdentification?: PayerIdentificationDTO;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  @ApiProperty({
    description:
      'Client-supplied UUID v4; deduplicates retries so network failures do not create duplicate charges.',
  })
  @IsUUID('4')
  idempotencyKey!: string;
}
