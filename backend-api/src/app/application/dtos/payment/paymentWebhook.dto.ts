import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class PaymentWebhookResourceDTO {
  @IsString()
  @MaxLength(64)
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class PaymentWebhookDTO {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  action?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  type?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PaymentWebhookResourceDTO)
  data: PaymentWebhookResourceDTO;

  constructor(data: PaymentWebhookResourceDTO, action?: string, type?: string) {
    this.data = data;
    this.action = action;
    this.type = type;
  }
}
