import { Injectable } from '@nestjs/common';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { Address } from '../../../domain/models/address.model';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class CreateAddressService {
  constructor(private readonly adapter: DatabaseAdapter<Address>) {}

  async execute(data: CreateAddressDTO): Promise<Address> {
    const addressRecord = await this.adapter.create(data);

    return Address.factory(
      addressRecord.id,
      addressRecord.zipCode,
      addressRecord.street,
      addressRecord.neighborhood,
      addressRecord.city,
      addressRecord.state,
      addressRecord.country,
      addressRecord.complement ?? undefined
    );
  }
}
