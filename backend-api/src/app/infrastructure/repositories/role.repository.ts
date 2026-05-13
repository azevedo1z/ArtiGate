import { Injectable } from '@nestjs/common';
import { Role as RoleRow } from '@prisma/client';
import { Role } from '../../domain/models/role.model';
import { CreateRoleDTO } from '../../application/dtos/role/createRole.dto';
import { UpdateRoleDTO } from '../../application/dtos/role/updateRole.dto';
import { RoleRepository } from '../../interface/repositories/role.repository.port';
import { PrismaService } from '../services/prisma.service';

const rowToDomain = (row: RoleRow): Role =>
  Role.factory({ id: row.id, name: row.name });

@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDTO): Promise<Role> {
    const row = await this.prisma.role.create({ data });
    return rowToDomain(row);
  }

  async update(data: UpdateRoleDTO): Promise<Role> {
    const { id, ...rest } = data;
    const row = await this.prisma.role.update({ where: { id }, data: rest });
    return rowToDomain(row);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.role.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<Role | null> {
    const row = await this.prisma.role.findFirst({ where: { id } });
    return row ? rowToDomain(row) : null;
  }

  async findAll(): Promise<Role[]> {
    const rows = await this.prisma.role.findMany();
    return rows.map(rowToDomain);
  }

  async findByIds(ids: string[]): Promise<Role[]> {
    const rows = await this.prisma.role.findMany({
      where: { id: { in: ids } },
    });
    return rows.map(rowToDomain);
  }

  async findByName(name: string): Promise<Role | null> {
    const row = await this.prisma.role.findFirst({ where: { name } });
    return row ? rowToDomain(row) : null;
  }
}
