import { Address } from '@prisma/client';
import { CreateAddressDTO } from '../../application/dtos/address/createAddress.dto';
import { PrismaService } from '../services/prisma.service';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { UpdateAddressDTO } from '../../application/dtos/address/updateAddress.dto';
import { AddressDatabaseAdapter } from '../../interface/adapter/database.adapter';

@Injectable()
export class AddressRepository implements AddressDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAddressDTO): Promise<Address> {
    return await this.prisma.address.create({ data });
  }

  async findById(id: string): Promise<Address | null> {
    return await this.prisma.address.findFirst({
      where: { id, deletedOn: null },
    });
  }

  async findAll(): Promise<Address[]> {
    return await this.prisma.address.findMany({ where: { deletedOn: null } });
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

  async findMany(_contextParam: string): Promise<Address[]> {
    throw new NotImplementedException();
  }
}
