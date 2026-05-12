import { Injectable } from '@nestjs/common';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { Address } from '../../../domain/models/address.model';
import { addressRowToDomain } from '../../mappers/address.mapper';
import { AddressDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class CreateAddressService {
  constructor(private readonly adapter: AddressDatabaseAdapter) {}

  async execute(data: CreateAddressDTO): Promise<Address> {
    Address.ensureInvariants({ id: '', ...data });

    const addressRecord = await this.adapter.create(data);
    return addressRowToDomain(addressRecord);
  }
}
