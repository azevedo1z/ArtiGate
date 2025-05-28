import { UserRole } from '@prisma/client';
import { UserRoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserRoleService {
  constructor(private readonly adapter: UserRoleDatabaseAdapter) {}

  async getAll(): Promise<UserRole[]> {
    const userRoles = await this.adapter.findAll();

    return [...userRoles];
  }
}
