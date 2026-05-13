import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/models/user.model';
import { UserRepository } from '../../../interface/repositories/user.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';
import {
  PaginatedResult,
  PaginationDTO,
  buildPaginatedResult,
  normalizePagination,
} from '../../../shared/dtos/pagination.dto';

@Injectable()
export class GetUserService {
  constructor(private readonly repo: UserRepository) {}

  async getById(id: string): Promise<User> {
    const existing = await this.repo.findById(id);

    if (existing == null)
      throw new NotFoundException(`There is no user with the ID "${id}".`);

    return existing;
  }

  async getAll(pagination?: PaginationDTO): Promise<PaginatedResult<User>> {
    const { page, limit } = normalizePagination(pagination);
    const [users, total] = await Promise.all([
      this.repo.findAll(pagination),
      this.repo.countAll(),
    ]);

    return buildPaginatedResult(users, total, page, limit);
  }

  async getByAddressId(addressId: string): Promise<User | null> {
    return this.repo.findByAddressId(addressId);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }
}
