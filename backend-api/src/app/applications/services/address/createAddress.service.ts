import { Injectable } from "@nestjs/common";
import { Address } from "../../../domain/models/address.model";
import { AddressRepository } from "../../../domain/repositories/address.repository";
import { CreateAddressDTO } from "../../dtos/address/createAddress.dto";

@Injectable()
export class CreateAddressService {
  constructor(private readonly repository: AddressRepository) {}

  async execute(data: CreateAddressDTO): Promise<Address> {
    return this.repository.create(data);
  }
}