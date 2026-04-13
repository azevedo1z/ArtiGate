import { UserRole } from '@prisma/client';
import { UserRoleDatabaseAdapter } from '../../interface/adapter/database.adapter';
import { PrismaService } from '../services/prisma.service';
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class UserRoleRepository implements UserRoleDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(_data: Partial<UserRole>): Promise<UserRole> {
    throw new NotImplementedException();
  }

  async update(_data: Partial<UserRole>): Promise<UserRole> {
    throw new NotImplementedException();
  }

  async delete(_id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  async findById(_id: string): Promise<UserRole | null> {
    throw new NotImplementedException();
  }

  async findAll(): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany({ where: { deletedOn: null } });
  }

  async findMany(_id: string): Promise<UserRole[]> {
    throw new NotImplementedException();
  }

  async countByField(field: string, value: string): Promise<number> {
    return await this.prisma.userRole.count({
      where: { [field]: value, deletedOn: null },
    });
  }

  async findManyByUserId(userId: string): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany({
      where: { userId, deletedOn: null },
    });
  }
}
