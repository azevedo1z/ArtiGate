import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { PAYMENT_METHOD_IDS } from '../../../shared/constants';
import { PayerIdentificationDTO } from './payerIdentification.dto.js';

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
      'Total amount to charge in major currency units (e.g. 19.99). Must be positive.',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(1_000_000)
  amount: number;

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
    message: `PaymentMethodId must be one of: ${PAYMENT_METHOD_IDS.join(
      ', '
    )}.`,
  })
  paymentMethodId: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(254)
  payerEmail: string;

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
  idempotencyKey: string;

  constructor(
    amount: number,
    paymentMethodId: string,
    payerEmail: string,
    idempotencyKey: string,
    token?: string,
    currency?: string,
    payerIdentification?: PayerIdentificationDTO,
    description?: string
  ) {
    this.amount = amount;
    this.paymentMethodId = paymentMethodId;
    this.payerEmail = payerEmail;
    this.idempotencyKey = idempotencyKey;
    this.token = token;
    this.currency = currency;
    this.payerIdentification = payerIdentification;
    this.description = description;
  }
}
