import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { User } from '../../../domain/models/user.model';
import { ArticleAuthor, UserRole } from '@prisma/client';

@Injectable()
export class GetUserService {
  constructor(private readonly repository: UserRepository) {}

  async getById(id: string): Promise<User | null> {
    const existingUser = await this.repository.findById(id);

    if (existingUser == null)
      throw new BadRequestException(`There is no user with the ID "${id}".`);

    return User.factory(
      existingUser.id,
      existingUser.name,
      existingUser.email,
      existingUser.phone,
      existingUser.homeAddressId,
      existingUser.jobAddressId,
      existingUser.badgeUrl,
      existingUser.passwordHash
    );
  }

  async getAll(): Promise<User[]> {
    const users = await this.repository.findAll();

    return users.map((existingUser) =>
      User.factory(
        existingUser.id,
        existingUser.name,
        existingUser.email,
        existingUser.phone,
        existingUser.homeAddressId,
        existingUser.jobAddressId,
        existingUser.badgeUrl,
        existingUser.passwordHash
      )
    );
  }

  async getAllRoles(): Promise<UserRole[]> {
    const userRoles = await this.repository.findAllRoles();

    return [...userRoles];
  }

  async getRolesByUserId(userId: string): Promise<UserRole[]> {
    const userRoles = await this.repository.findRolesByAuthorId(userId);

    return [...userRoles];
  }

  async getByEmail(email: string): Promise<User> {
    const existingUser = await this.repository.findByEmail(email);

    if (existingUser == null)
      throw new BadRequestException(
        `There is no user with the E-mail "${email}".`
      );

    return User.factory(
      existingUser.id,
      existingUser.name,
      existingUser.email,
      existingUser.phone,
      existingUser.homeAddressId,
      existingUser.jobAddressId,
      existingUser.badgeUrl,
      existingUser.passwordHash
    );
  }

  async getByAddressId(addressId: string): Promise<User[]> {
    const users = await this.repository.findByAddressId(addressId);

    return users.map((existingUser) =>
      User.factory(
        existingUser.id,
        existingUser.name,
        existingUser.email,
        existingUser.phone,
        existingUser.homeAddressId,
        existingUser.jobAddressId,
        existingUser.badgeUrl,
        existingUser.passwordHash
      )
    );
  }

  async getByArticleId(articleId: string): Promise<ArticleAuthor[]> {
    return await this.repository.findByArticleId(articleId);
  }

  async getByReviewId(reviewId: string): Promise<User[]> {
    const reviewers = await this.repository.findByReviewId(reviewId);

    return reviewers.map((reviewer) =>
      User.factory(
        reviewer.id,
        reviewer.name,
        reviewer.email,
        reviewer.phone,
        reviewer.homeAddressId,
        reviewer.jobAddressId,
        reviewer.badgeUrl,
        reviewer.passwordHash
      )
    );
  }
}
