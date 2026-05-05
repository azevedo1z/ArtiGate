import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { PAYMENT_PAYER_IDENTIFICATION_TYPES } from '../../../shared/constants';
import {
  getPayerIdRegex,
  getPayerIdType,
} from '../../../shared/helpers/helpers';

const EnsurePayerIdMatchesPattern =
  (validationOptions?: ValidationOptions): PropertyDecorator =>
  (target, propertyKey) => {
    registerDecorator({
      name: 'ensurePayerIdMatchesPattern',
      target: target.constructor,
      propertyName: propertyKey as string,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (value == null || value === '') return true;
          const dto = args.object as { type?: string };
          const type = getPayerIdType(dto.type);
          if (!type) return false;
          const pattern = getPayerIdRegex(type);
          if (!pattern) return false;
          return pattern.test(String(value).trim());
        },
        defaultMessage(args: ValidationArguments) {
          const dto = args.object as { type?: string };
          const type = getPayerIdType(dto.type);
          if (!type) return 'payerIdentification.type is required.';
          if (!getPayerIdRegex(type))
            return `payerIdentification.type "${type}" is not supported.`;
          return `payerIdentification.number must match ${type} format.`;
        },
      },
    });
  };

export class PayerIdentificationDTO {
  @ApiProperty({
    description: `Document type. Allowed values: ${PAYMENT_PAYER_IDENTIFICATION_TYPES.join(
      ', '
    )}.`,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value
  )
  @IsIn(PAYMENT_PAYER_IDENTIFICATION_TYPES, {
    message: `payerIdentification.type must be one of: ${PAYMENT_PAYER_IDENTIFICATION_TYPES.join(
      ', '
    )}.`,
  })
  type!: string;

  @ApiProperty({
    description:
      'Document number. Format must match the selected document type.',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @EnsurePayerIdMatchesPattern()
  number!: string;
}
