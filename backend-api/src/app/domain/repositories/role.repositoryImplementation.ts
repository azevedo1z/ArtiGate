import { Injectable } from '@nestjs/common';
import { CreateRoleDTO } from '../../application/dtos/role/createRole.dto';
import { Role } from '@prisma/client';
import { RoleRepository } from './role.repository';
import { PrismaService } from '../../infrastructure/prisma.service';
import { UpdateRoleDTO } from '../../application/dtos/role/updateRole.dto';

@Injectable()
export class RoleRepositoryImplementation implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({
      where: { name },
    });
  }

  async findById(id: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({
      where: { id },
    });
  }

  async create(data: CreateRoleDTO): Promise<Role> {
    return await this.prisma.role.create({ data });
  }

  async update(data: UpdateRoleDTO): Promise<Role> {
    //TODO: Globalize this
    const dataToUpdate = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    return await this.prisma.role.update({
      where: { id: data.id },
      data: dataToUpdate,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.role.update({
      where: { id: id },
      data: { deletedOn: new Date() },
    });

    return true;
  }

  async findAll(): Promise<Role[]> {
    return await this.prisma.role.findMany();
  }
}
