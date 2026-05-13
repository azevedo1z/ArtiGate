import { User as UserRow } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/models/user.model';
import { PrismaService } from '../services/prisma.service';
import {
  CreateUserPersistenceInput,
  UpdateUserPersistenceInput,
  UserRepository,
} from '../../interface/repositories/user.repository.port';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

const rowToDomain = (row: UserRow): User =>
  User.factory({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    homeAddressId: row.homeAddressId,
    jobAddressId: row.jobAddressId,
    badgeUrl: row.badgeUrl,
    passwordHash: row.passwordHash,
  });

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserPersistenceInput): Promise<User> {
    const row = await this.prisma.$transaction(async (tx) => {
      const userRecord = await tx.user.create({
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          badgeUrl: input.badgeUrl,
          homeAddressId: input.homeAddressId,
          jobAddressId: input.jobAddressId,
          passwordHash: input.passwordHash,
        },
      });

      if (input.roleIds.length > 0) {
        await tx.userRole.createMany({
          data: input.roleIds.map((roleId) => ({
            userId: userRecord.id,
            roleId,
          })),
        });
      }

      return userRecord;
    });
    return rowToDomain(row);
  }

  async update(input: UpdateUserPersistenceInput): Promise<User> {
    const row = await this.prisma.$transaction(async (tx) => {
      if (input.roleIds !== undefined) {
        await tx.userRole.deleteMany({ where: { userId: input.id } });
        if (input.roleIds.length > 0) {
          await tx.userRole.createMany({
            data: input.roleIds.map((roleId) => ({
              userId: input.id,
              roleId,
            })),
          });
        }
      }

      return tx.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          badgeUrl: input.badgeUrl,
          homeAddressId: input.homeAddressId,
          jobAddressId: input.jobAddressId,
          passwordHash: input.passwordHash,
        },
      });
    });
    return rowToDomain(row);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findFirst({ where: { id } });
    return row ? rowToDomain(row) : null;
  }

  async findAll(pagination?: PaginationDTO): Promise<User[]> {
    const { skip, take } = normalizePagination(pagination);
    const rows = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
    return rows.map(rowToDomain);
  }

  async countAll(): Promise<number> {
    return this.prisma.user.count();
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findFirst({ where: { email } });
    return row ? rowToDomain(row) : null;
  }

  async findByIds(ids: string[]): Promise<User[]> {
    if (!ids.length) return [];
    const rows = await this.prisma.user.findMany({
      where: { id: { in: ids } },
    });
    return rows.map(rowToDomain);
  }

  async findByAddressId(addressId: string): Promise<User | null> {
    const row = await this.prisma.user.findFirst({
      where: {
        OR: [{ jobAddressId: addressId }, { homeAddressId: addressId }],
      },
    });
    return row ? rowToDomain(row) : null;
  }
}
