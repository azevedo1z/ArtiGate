import { ArticleAuthor, User, UserRole } from '@prisma/client';
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

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findAllRoles(): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany();
  }

  async findRolesByAuthorId(userId: string): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany({ where: { userId } });
  }

  async findByAddressId(addressId: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        OR: [{ jobAddressId: addressId }, { homeAddressId: addressId }],
      },
    });
  }

  async findByArticleId(articleId: string): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany({
      where: { articleId: articleId },
    });
  }

  async findByReviewId(reviewId: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: { reviews: { some: { id: reviewId } } },
    });
  }
}
