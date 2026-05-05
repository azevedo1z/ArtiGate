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
  id!: string;
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

  // Marked optional so legacy Mercado Pago IPN notifications (which carry the
  // resource id only in the query string) are not rejected by the global
  // ValidationPipe before the controller can apply its query-param fallback.
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentWebhookResourceDTO)
  data?: PaymentWebhookResourceDTO;
}
