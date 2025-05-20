import { UserRole } from '@prisma/client';
import { DatabaseAdapter } from '../../interface/adapter/database.adapter';
import { PrismaService } from '../services/prisma.service';

export class UserRoleRepository implements DatabaseAdapter<UserRole> {
  constructor(private readonly prisma: PrismaService) {}

  async findBy(id: string): Promise<UserRole | null> {
    return await this.prisma.userRole.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany();
  }

  async findManyBy(userId: string): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany({ where: { userId } });
  }

  async create(data: Partial<UserRole>): Promise<UserRole> {
    throw new Error('Method not implemented.');
  }

  async update(data: Partial<UserRole>): Promise<UserRole> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
