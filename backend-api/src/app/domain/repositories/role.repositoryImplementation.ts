import { Injectable } from '@nestjs/common';
import { CreateRoleDTO } from '../../applications/dtos/role/createRole.dto';
import { Role } from '@prisma/client';
import { RoleRepository } from './role.repository';
import { PrismaService } from '../../infrastructure/prisma.service';

@Injectable()
export class RoleRepositoryImplementation implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async create(data: CreateRoleDTO): Promise<Role> {
    return this.prisma.role.create({ data });
  }
}
