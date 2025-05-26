import { UserRole } from '@prisma/client';
import { UserRoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';

export class GetUserRoleService {
  constructor(private readonly adapter: UserRoleDatabaseAdapter) {}

  async getAllUserRoles(): Promise<UserRole[]> {
    const userRoles = await this.adapter.findAll();

    return [...userRoles];
  }
}
