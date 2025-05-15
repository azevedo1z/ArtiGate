import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../../../infrastructure/repositories/address.repository';
import { UpdateAddressDTO } from '../../dtos/address/updateAddress.dto';
import { Address } from '../../../domain/models/address.model';
import { GetAddressService } from './getAddress.service';

@Injectable()
export class UpdateAddressService {
  constructor(
    private readonly repository: AddressRepository,
    private readonly getAddressService: GetAddressService
  ) {}

  async execute(data: UpdateAddressDTO): Promise<Address> {
    await this.getAddressService.getById(data.id);

    const addressRecord = await this.repository.update(data);

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
