import { Injectable } from '@nestjs/common';
import { LookupZipCodeResponseDTO } from '../../dtos/zipCode/lookupZipCode.dto';
import { ZipCodeLookupAdapter } from '../../../interface/adapter/zipCodeLookup.adapter';
import { ValidationException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class LookupZipCodeService {
  constructor(private readonly adapter: ZipCodeLookupAdapter) {}

  async execute(zipCode: string): Promise<LookupZipCodeResponseDTO> {
    const normalized = zipCode.replace(/\D/g, '');

    if (normalized.length !== 8)
      throw new ValidationException(
        'Zip code must contain exactly 8 digits.'
      );

    const result = await this.adapter.lookup(normalized);

    return new LookupZipCodeResponseDTO(
      result.zipCode,
      result.street,
      result.neighborhood,
      result.city,
      result.state
    );
  }
}
