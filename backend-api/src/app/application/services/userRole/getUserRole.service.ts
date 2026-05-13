import {
  UserRoleRecord,
  UserRoleRepository,
} from '../../../interface/repositories/userRole.repository.port';
import { UserRepository } from '../../../interface/repositories/user.repository.port';
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetUserRoleService {
  constructor(
    private readonly repo: UserRoleRepository,
    private readonly userRepo: UserRepository
  ) {}

  async getAll(): Promise<UserRoleRecord[]> {
    return this.repo.findAll();
  }

  async getByUserId(userId: string): Promise<UserRoleRecord[]> {
    const user = await this.userRepo.findById(userId);
    if (!user)
      throw new NotFoundException(`User with ID "${userId}" not found`);

    const existing = await this.repo.findManyByUserId(userId);

    if (existing.length === 0)
      throw new NotFoundException(
        'There is no role associated with this user.'
      );

    return existing;
  }
}
