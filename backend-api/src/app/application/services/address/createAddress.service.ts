import { Injectable } from '@nestjs/common';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { Address } from '../../../domain/models/address.model';
import { AddressRepository } from '../../../interface/repositories/address.repository.port';

@Injectable()
export class CreateAddressService {
  constructor(private readonly repo: AddressRepository) {}

  async execute(data: CreateAddressDTO): Promise<Address> {
    Address.ensureInvariants({ id: '', ...data });
    return this.repo.create(data);
  }
}
