import { Address } from '@prisma/client';
import { CreateAddressDTO } from '../../application/dtos/address/createAddress.dto';
import { AddressRepository } from './address.repository';
import { PrismaService } from '../../infrastructure/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateAddressDTO } from '../../application/dtos/address/updateAddress.dto';

@Injectable()
export class AddressRepositoryImplementation implements AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAddressDTO): Promise<Address> {
    return await this.prisma.address.create({ data });
  }

  async findById(id: string): Promise<Address | null> {
    return await this.prisma.address.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Address[]> {
    return await this.prisma.address.findMany();
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.address.update({
      where: { id: id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async update(data: UpdateAddressDTO): Promise<Address> {
    return await this.prisma.address.update({
      where: { id: data.id },
      data,
    });
  }
}
