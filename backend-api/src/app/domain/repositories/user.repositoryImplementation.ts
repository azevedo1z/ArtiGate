import { User } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma.service';
import { CreateUserDTO } from '../../application/dtos/user/createUser.dto';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryImplementation implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(
    data: CreateUserDTO,
    homeAddressId: string,
    jobAddressId: string
  ): Promise<User> {
    const user = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      badgeUrl: data.badgeUrl,
      homeAddressId,
      jobAddressId,
    };

    const userRecord = await this.prisma.user.create({ data: user });

    for (const roleId of data.roleIds) {
      await this.prisma.userRole.create({
        data: { userId: userRecord.id, roleId },
      });
    }

    return userRecord;
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
