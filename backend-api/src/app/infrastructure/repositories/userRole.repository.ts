import { UserRole as UserRoleRow } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import {
  UserRoleRecord,
  UserRoleRepository,
} from '../../interface/repositories/userRole.repository.port';

const toRecord = (row: UserRoleRow): UserRoleRecord => ({
  id: row.id,
  userId: row.userId,
  roleId: row.roleId,
});

@Injectable()
export class PrismaUserRoleRepository implements UserRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserRoleRecord[]> {
    const rows = await this.prisma.userRole.findMany();
    return rows.map(toRecord);
  }

  async findManyByUserId(userId: string): Promise<UserRoleRecord[]> {
    const rows = await this.prisma.userRole.findMany({ where: { userId } });
    return rows.map(toRecord);
  }

  async countByField(field: string, value: string): Promise<number> {
    return this.prisma.userRole.count({ where: { [field]: value } });
  }
}
