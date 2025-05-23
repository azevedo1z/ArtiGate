import { Injectable } from '@nestjs/common';
import { UpdateAddressDTO } from '../../dtos/address/updateAddress.dto';
import { Address } from '../../../domain/models/address.model';
import { GetAddressService } from './getAddress.service';
import { AddressDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class UpdateAddressService {
  constructor(
    private readonly adapter: AddressDatabaseAdapter,
    private readonly getAddressService: GetAddressService
  ) {}

  async execute(data: UpdateAddressDTO): Promise<Address> {
    await this.getAddressService.getById(data.id);

    const addressRecord = await this.adapter.update(data);

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
