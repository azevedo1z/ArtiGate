import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/models/user.model';
import { userRowToDomain } from '../../mappers/user.mapper';
import { UserDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';
import {
  PaginatedResult,
  PaginationDTO,
  buildPaginatedResult,
  normalizePagination,
} from '../../../shared/dtos/pagination.dto';

@Injectable()
export class GetUserService {
  constructor(private readonly adapter: UserDatabaseAdapter) {}

  async getById(id: string): Promise<User> {
    const existingUser = await this.adapter.findById(id);

    if (existingUser == null)
      throw new NotFoundException(`There is no user with the ID "${id}".`);

    return userRowToDomain(existingUser);
  }

  async getAll(pagination?: PaginationDTO): Promise<PaginatedResult<User>> {
    const { page, limit } = normalizePagination(pagination);
    const [users, total] = await Promise.all([
      this.adapter.findAll(pagination),
      this.adapter.countAll?.() ?? Promise.resolve(0),
    ]);

    return buildPaginatedResult(users.map(userRowToDomain), total, page, limit);
  }

  async getByAddressId(addressId: string): Promise<User | null> {
    const existingUser = await this.adapter.findByAddressId?.(addressId);
    if (existingUser == null) return null;
    return userRowToDomain(existingUser);
  }

  async getByReviewId(reviewId: string): Promise<User> {
    const existingUser = await this.adapter.findByReviewId?.(reviewId);

    if (existingUser == null)
      throw new NotFoundException(
        `There is no user with the reviewId "${reviewId}".`
      );

    return userRowToDomain(existingUser);
  }

  async getByEmail(email: string): Promise<User | null> {
    const existingUser = await this.adapter.findByEmail?.(email);
    if (!existingUser) return null;
    return userRowToDomain(existingUser);
  }
}
