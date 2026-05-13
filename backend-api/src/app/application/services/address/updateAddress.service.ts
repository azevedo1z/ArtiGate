import { Injectable } from '@nestjs/common';
import { UpdateAddressDTO } from '../../dtos/address/updateAddress.dto';
import { Address } from '../../../domain/models/address.model';
import { AddressRepository } from '../../../interface/repositories/address.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateAddressService {
  constructor(private readonly repo: AddressRepository) {}

  async execute(data: UpdateAddressDTO): Promise<Address> {
    const existing = await this.repo.findById(data.id);
    if (!existing)
      throw new NotFoundException(`Address with ID "${data.id}" not found`);

    Address.ensureInvariants({
      id: existing.id,
      zipCode: data.zipCode ?? existing.zipCode,
      street: data.street ?? existing.street,
      neighborhood: data.neighborhood ?? existing.neighborhood,
      city: data.city ?? existing.city,
      state: data.state ?? existing.state,
      complement:
        data.complement === undefined ? existing.complement : data.complement,
      country: existing.country,
    });

    return this.repo.update(data);
  }
}
