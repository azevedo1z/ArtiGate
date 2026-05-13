import { Address as AddressRow } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Address } from '../../domain/models/address.model';
import { CreateAddressDTO } from '../../application/dtos/address/createAddress.dto';
import { UpdateAddressDTO } from '../../application/dtos/address/updateAddress.dto';
import { AddressRepository } from '../../interface/repositories/address.repository.port';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';
import { PrismaService } from '../services/prisma.service';

const rowToDomain = (row: AddressRow): Address =>
  Address.factory({
    id: row.id,
    zipCode: row.zipCode,
    street: row.street,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    country: row.country,
    complement: row.complement,
  });

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAddressDTO): Promise<Address> {
    const row = await this.prisma.address.create({ data });
    return rowToDomain(row);
  }

  async update(data: UpdateAddressDTO): Promise<Address> {
    const { id, ...rest } = data;
    const row = await this.prisma.address.update({
      where: { id },
      data: rest,
    });
    return rowToDomain(row);
  }

  async findById(id: string): Promise<Address | null> {
    const row = await this.prisma.address.findFirst({ where: { id } });
    return row ? rowToDomain(row) : null;
  }

  async findAll(pagination?: PaginationDTO): Promise<Address[]> {
    const { skip, take } = normalizePagination(pagination);
    const rows = await this.prisma.address.findMany({ skip, take });
    return rows.map(rowToDomain);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.address.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }
}
