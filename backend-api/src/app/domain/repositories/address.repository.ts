import { Address } from '@prisma/client';
import { CreateAddressDTO } from '../../application/dtos/address/createAddress.dto';
import { UpdateAddressDTO } from '../../application/dtos/address/updateAddress.dto';

export abstract class AddressRepository {
  abstract create(data: CreateAddressDTO): Promise<Address>;
  abstract findById(id: string): Promise<Address | null>;
  abstract findAll(): Promise<Address[]>;
  abstract update(data: UpdateAddressDTO): Promise<Address>;
}
