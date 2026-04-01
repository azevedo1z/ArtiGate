import { UserRole } from '@prisma/client';
import { UserRoleDatabaseAdapter } from '../../interface/adapter/database.adapter';
import { PrismaService } from '../services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRoleRepository implements UserRoleDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(_data: Partial<UserRole>): Promise<UserRole> {
    throw new Error('Method not implemented.');
  }

  async update(_data: Partial<UserRole>): Promise<UserRole> {
    throw new Error('Method not implemented.');
  }

  async delete(_id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findById(_id: string): Promise<UserRole | null> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany();
  }

  async findMany(_id: string): Promise<UserRole[]> {
    throw new Error('Method not implemented.');
  }

  async findManyByUserId(userId: string): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany({ where: { userId } });
  }
}
