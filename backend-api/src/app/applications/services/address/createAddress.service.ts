import { Injectable } from "@nestjs/common";
import { AddressRepository } from '../../../domain/repositories/address.repository';
import { CreateAddressDTO } from "../../dtos/address/createAddress.dto";
import { Address } from "@prisma/client";

@Injectable()
export class CreateAddressService {
  constructor(private readonly repository: AddressRepository) {}

  async execute(data: CreateAddressDTO): Promise<Address> {
    const address = this.repository.create(data);

    return address;
  }
}