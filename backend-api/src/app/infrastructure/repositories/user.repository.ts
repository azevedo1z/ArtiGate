import { User } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { CreateUserDTO } from '../../application/dtos/user/createUser.dto';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { UpdateUserDTO } from '../../application/dtos/user/updateUser.dto';
import { UserDatabaseAdapter } from '../../interface/adapter/database.adapter';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

@Injectable()
export class UserRepository implements UserDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUserDTO,
    homeAddressId: string,
    jobAddressId: string
  ): Promise<User> {
    return await this.prisma.$transaction(async (tx) => {
      const userRecord = await tx.user.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          badgeUrl: data.badgeUrl,
          homeAddressId,
          jobAddressId,
          passwordHash: data.password,
        },
      });

      if (data.roleIds.length > 0) {
        await tx.userRole.createMany({
          data: data.roleIds.map((roleId) => ({
            userId: userRecord.id,
            roleId,
          })),
        });
      }

      return userRecord;
    });
  }

  async update(
    data: UpdateUserDTO,
    homeAddressId: string | undefined,
    jobAddressId: string | undefined,
    roleChanged: boolean
  ): Promise<User> {
    return await this.prisma.$transaction(async (tx) => {
      if (roleChanged) {
        await tx.userRole.deleteMany({ where: { userId: data.id } });
        await tx.userRole.createMany({
          data: data.roleIds.map((roleId) => ({
            userId: data.id,
            roleId,
          })),
        });
      }

      return await tx.user.update({
        where: { id: data.id },
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          badgeUrl: data.badgeUrl,
          homeAddressId,
          jobAddressId,
          passwordHash: data.password,
        },
      });
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.update({
      where: { id: id },
      data: { deletedOn: new Date() },
    });

    return true;
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async findAll(pagination?: PaginationDTO): Promise<User[]> {
    const { skip, take } = normalizePagination(pagination);
    return await this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
  }

  async countAll(): Promise<number> {
    return await this.prisma.user.count();
  }

  async findMany(): Promise<User[]> {
    throw new NotImplementedException();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findByIds(ids: string[]): Promise<User[]> {
    if (!ids.length) return [];
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
    });
  }

  async findByAddressId(addressId: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ jobAddressId: addressId }, { homeAddressId: addressId }],
      },
    });
  }

  async findByReviewId(reviewId: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { reviews: { some: { id: reviewId } } },
    });
  }
}
