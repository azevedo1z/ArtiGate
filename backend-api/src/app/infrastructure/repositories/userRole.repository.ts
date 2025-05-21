import { UserRole } from '@prisma/client';
import { DatabaseAdapter } from '../../interface/adapter/database.adapter';
import { PrismaService } from '../services/prisma.service';

export class UserRoleRepository implements DatabaseAdapter<UserRole> {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<UserRole>): Promise<UserRole> {
    throw new Error('Method not implemented.');
  }

  async update(data: Partial<UserRole>): Promise<UserRole> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<UserRole | null> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany();
  }

  async findMany(userId: string): Promise<UserRole[]> {
    throw new Error('Method not implemented.');
  }
}
