import { Injectable } from "@nestjs/common";
import { AddressRepository } from '../../../domain/repositories/address.repository';
import { CreateAddressDTO } from "../../dtos/address/createAddress.dto";

@Injectable()
export class CreateAddressService {
  constructor(private readonly repository: AddressRepository) {}

  async execute(data: CreateAddressDTO): Promise<string> {
    const address = this.repository.create(data);

    return (await address).id;
  }
}