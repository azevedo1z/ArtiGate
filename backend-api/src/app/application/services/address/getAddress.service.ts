import { BadRequestException, Injectable } from '@nestjs/common';
import { Address } from '../../../domain/models/address.model';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class GetAddressService {
  constructor(private readonly adapter: DatabaseAdapter<Address>) {}

  async getById(id: string): Promise<Address | null> {
    const existingAddress = await this.adapter.findBy(id);

    if (existingAddress == null)
      throw new BadRequestException(`There is no address with the ID "${id}".`);

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
    const addresses = await this.adapter.findAll();

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
