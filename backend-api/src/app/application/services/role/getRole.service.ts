import { Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
import { roleRowToDomain } from '../../mappers/role.mapper';
import {
  RoleDatabaseAdapter,
  UserRoleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetRoleService {
  constructor(
    private readonly adapter: RoleDatabaseAdapter,
    private readonly userRoleAdapter: UserRoleDatabaseAdapter
  ) {}

  async getById(id: string): Promise<Role> {
    const existingRole = await this.adapter.findById(id);

    if (!existingRole)
      throw new NotFoundException(`There is no role with the ID "${id}".`);

    return roleRowToDomain(existingRole);
  }

  async getAll(): Promise<Role[]> {
    const roles = await this.adapter.findAll();
    return roles.map(roleRowToDomain);
  }

  async getRoleByUserId(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleAdapter.findManyByUserId?.(userId);

    if (!userRoles?.length) return [];

    const roleIds = userRoles.map((ur) => ur.roleId);
    const roles = (await this.adapter.findByIds?.(roleIds)) ?? [];

    return roles.map(roleRowToDomain);
  }
}
