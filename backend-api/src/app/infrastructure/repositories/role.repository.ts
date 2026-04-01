import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateRoleDTO } from '../../application/dtos/role/createRole.dto';
import { Role } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { UpdateRoleDTO } from '../../application/dtos/role/updateRole.dto';
import { RoleDatabaseAdapter } from '../../interface/adapter/database.adapter';

@Injectable()
export class RoleRepository implements RoleDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDTO): Promise<Role> {
    return await this.prisma.role.create({ data });
  }

  async update(data: UpdateRoleDTO): Promise<Role> {
    return await this.prisma.role.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.role.update({
      where: { id: id },
      data: { deletedOn: new Date() },
    });

    return true;
  }

  async findById(id: string): Promise<Role | null> {
    return await this.prisma.role.findFirst({ where: { id, deletedOn: null } });
  }

  async findAll(): Promise<Role[]> {
    return await this.prisma.role.findMany({ where: { deletedOn: null } });
  }

  async findMany(): Promise<Role[]> {
    throw new NotImplementedException();
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.prisma.role.findFirst({ where: { name, deletedOn: null } });
  }
}
