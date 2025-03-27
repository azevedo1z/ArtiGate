import { Address } from '@prisma/client';
import { CreateAddressDTO } from '../../applications/dtos/address/createAddress.dto';
import { AddressRepository } from './address.repository';
import { PrismaService } from '../../infrastructure/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressRepositoryImplementation implements AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAddressDTO): Promise<Address> {
    const address = {
      city: data.city,
      neighborhood: data.neighborhood,
      state: data.state,
      street: data.street,
      zipCode: data.zipCode,
      complement: data.complement ?? undefined,
    };
    return this.prisma.address.create({ data: address });
  }

  async findById(id: string): Promise<Address | null> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Array<Address>> {
    return this.prisma.address.findMany();
  }
}
