import { UserRole } from '@prisma/client';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

export class GetUserRoleService {
  constructor(private readonly adapter: DatabaseAdapter<UserRole>) {}

  async getAllRoles(): Promise<UserRole[]> {
    const userRoles = await this.adapter.findAll();

    return [...userRoles];
  }

  async getRolesByUserId(userId: string): Promise<UserRole[]> {
    const userRoles = await this.adapter.findManyBy(userId);

    return [...userRoles];
  }
}
