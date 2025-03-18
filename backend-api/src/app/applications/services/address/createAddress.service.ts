import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../../../domain/repositories/address.repository';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { Address } from '../../../domain/models/address.model';

@Injectable()
export class CreateAddressService {
  constructor(private readonly repository: AddressRepository) {}

  async execute(data: CreateAddressDTO): Promise<Address> {
    const addressRecord = await this.repository.create(data);

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
