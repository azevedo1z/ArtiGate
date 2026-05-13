import { Injectable } from '@nestjs/common';
import { Address } from '../../../domain/models/address.model';
import { AddressRepository } from '../../../interface/repositories/address.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetAddressService {
  constructor(private readonly repo: AddressRepository) {}

  async getById(id: string): Promise<Address> {
    const existing = await this.repo.findById(id);

    if (existing == null)
      throw new NotFoundException(`There is no address with the ID "${id}".`);

    return existing;
  }

  async getAll(): Promise<Address[]> {
    return this.repo.findAll();
  }
}
