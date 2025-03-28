import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../../../domain/repositories/address.repository';
import { Address } from '../../../domain/models/address.model';

@Injectable()
export class GetAddressService {
  constructor(private readonly repository: AddressRepository) {}

  async getById(id: string): Promise<Address | null> {
    const existingAddress = await this.repository.findById(id);

    if (existingAddress == null)
      throw new Error(`There is no address with the ID "${id}".`);

    return Address.factory(
      existingAddress.id,
      existingAddress.zipCode,
      existingAddress.street,
      existingAddress.neighborhood,
      existingAddress.city,
      existingAddress.state,
      existingAddress.country,
      existingAddress.complement ?? undefined
    );
  }

  async getAll(): Promise<Address[]> {
    const addresses = await this.repository.findAll();

    return addresses.map((existingAddress) =>
      Address.factory(
        existingAddress.id,
        existingAddress.zipCode,
        existingAddress.street,
        existingAddress.neighborhood,
        existingAddress.city,
        existingAddress.state,
        existingAddress.country,
        existingAddress.complement ?? undefined
      )
    );
  }
}
