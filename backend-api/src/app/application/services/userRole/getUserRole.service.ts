import { UserRole } from '@prisma/client';
import {
  UserRoleDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { Injectable } from '@nestjs/common';
import {
  ValidationException,
  NotFoundException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetUserRoleService {
  constructor(
    private readonly adapter: UserRoleDatabaseAdapter,
    private readonly userAdapter: UserDatabaseAdapter
  ) {}

  async getAll(): Promise<UserRole[]> {
    const userRoles = await this.adapter.findAll();

    return [...userRoles];
  }

  async getByUserId(userId: string): Promise<UserRole[]> {
    if (!this.adapter.findManyByUserId)
      throw new ValidationException('Database adapter is not available.');

    const user = await this.userAdapter.findById(userId);
    if (!user)
      throw new NotFoundException(`User with ID "${userId}" not found`);

    const existingUserRoles = await this.adapter.findManyByUserId(userId);

    if (existingUserRoles.length === 0)
      throw new NotFoundException(
        'There is no role associated with this user.'
      );

    return [...existingUserRoles];
  }
}
