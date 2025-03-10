import { Address } from "@prisma/client";
import { CreateAddressDTO } from "../../applications/dtos/address/createAddress.dto";
import { AddressRepository } from "./address.repository";
import { PrismaService } from "../../infrastructure/prisma.service";

export class AddressRepositoryImplementation implements AddressRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateAddressDTO): Promise<Address> {
    return this.prisma.address.create({ data });
  }
}