import { UserRole } from '@prisma/client';
import { UserRoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class GetUserRoleService {
  constructor(private readonly adapter: UserRoleDatabaseAdapter) {}

  async getAll(): Promise<UserRole[]> {
    const userRoles = await this.adapter.findAll();

    return [...userRoles];
  }

  async getByUserId(userId: string): Promise<UserRole[]> {
    if (!this.adapter.findManyByUserId)
      throw new BadRequestException('Database adapter is not available.');

    const existingUserRoles = await this.adapter.findManyByUserId(userId);

    if (existingUserRoles.length === 0)
      throw new BadRequestException(
        'There is no role associated with this user.'
      );

    return [...existingUserRoles];
  }
}
