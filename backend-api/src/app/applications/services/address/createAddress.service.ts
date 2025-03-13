import { Injectable } from "@nestjs/common";
import { AddressRepository } from '../../../domain/repositories/address.repository';
import { CreateAddressDTO } from "../../dtos/address/createAddress.dto";
import { Address } from "../../../domain/models/address.model";

@Injectable()
export class CreateAddressService {
  constructor(private readonly repository: AddressRepository) {}

  async execute(data: CreateAddressDTO): Promise<Address> {

    const address = await this.repository.create(data);

    return Address.factory(
      address.id,
      address.zipCode,
      address.street,
      address.neighborhood,
      address.city,
      address.state,
      address.country,
      address.complement ?? undefined
    );
  }
}