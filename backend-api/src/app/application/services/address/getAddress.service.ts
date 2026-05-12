import { Injectable } from '@nestjs/common';
import { Address } from '../../../domain/models/address.model';
import { addressRowToDomain } from '../../mappers/address.mapper';
import { AddressDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetAddressService {
  constructor(private readonly adapter: AddressDatabaseAdapter) {}

  async getById(id: string): Promise<Address> {
    const existingAddress = await this.adapter.findById(id);

    if (existingAddress == null)
      throw new NotFoundException(`There is no address with the ID "${id}".`);

    return addressRowToDomain(existingAddress);
  }

  async getAll(): Promise<Address[]> {
    const addresses = await this.adapter.findAll();
    return addresses.map(addressRowToDomain);
  }
}
