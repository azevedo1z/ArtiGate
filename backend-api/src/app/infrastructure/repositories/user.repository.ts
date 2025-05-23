import { User } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { CreateUserDTO } from '../../application/dtos/user/createUser.dto';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { UpdateUserDTO } from '../../application/dtos/user/updateUser.dto';
import { UserDatabaseAdapter } from '../../interface/adapter/database.adapter';

@Injectable()
export class UserRepository implements UserDatabaseAdapter{
  constructor(private readonly prisma: PrismaService) {}

  
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
      passwordHash: data.password,
    };
    
    const userRecord = await this.prisma.user.create({ data: user });
    
    for (const roleId of data.roleIds) {
      await this.prisma.userRole.create({
        data: { userId: userRecord.id, roleId },
      });
    }
    
    return userRecord;
  }
  
  async update(
    data: UpdateUserDTO,
    homeAddressId: string | undefined,
    jobAddressId: string | undefined,
    roleChanged: boolean
  ): Promise<User> {
    const user = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      badgeUrl: data.badgeUrl,
      homeAddressId,
      jobAddressId,
      passwordHash: data.password,
    };
    
    if (roleChanged) {
      for (const roleId of data.roleIds) {
        await this.prisma.userRole.delete({ where: { id: data.id } });
        await this.prisma.userRole.create({
          data: { userId: data.id, roleId },
        });
      }
    }
    
    return await this.prisma.user.update({
      where: { id: data.id },
      data: user,
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
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
  
  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
  
  async findMany(): Promise<User[]> {
    throw new NotImplementedException();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
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
