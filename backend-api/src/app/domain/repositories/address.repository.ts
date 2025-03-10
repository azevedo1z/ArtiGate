import { Address } from "@prisma/client";
import { CreateAddressDTO } from "../../applications/dtos/address/createAddress.dto";

export abstract class AddressRepository {
  abstract create(data: CreateAddressDTO): Promise<Address>;
}