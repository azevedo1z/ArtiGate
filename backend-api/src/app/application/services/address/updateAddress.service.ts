import { Injectable } from '@nestjs/common';
import { UpdateAddressDTO } from '../../dtos/address/updateAddress.dto';
import { Address } from '../../../domain/models/address.model';
import { addressRowToDomain } from '../../mappers/address.mapper';
import { AddressDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateAddressService {
  constructor(private readonly adapter: AddressDatabaseAdapter) {}

  async execute(data: UpdateAddressDTO): Promise<Address> {
    const existingAddress = await this.adapter.findById(data.id);
    if (!existingAddress)
      throw new NotFoundException(`Address with ID "${data.id}" not found`);

    const addressRecord = await this.adapter.update(data);
    return addressRowToDomain(addressRecord);
  }
}
