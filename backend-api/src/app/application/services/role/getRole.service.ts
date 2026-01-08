import { Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
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

  async getById(id: string): Promise<Role | null> {
    const existingRole = await this.adapter.findById(id);

    if (!existingRole)
      throw new NotFoundException(`There is no role with the ID "${id}".`);

    return Role.factory(existingRole.id, existingRole.name);
  }

  async getAll(): Promise<Role[]> {
    const roles = await this.adapter.findAll();

    return roles.map((existingRole) =>
      Role.factory(existingRole.id, existingRole.name)
    );
  }

  async getRoleByUserId(userId: string): Promise<Role[]> {
    const existingUserRoles = await this.userRoleAdapter.findAll();

    const userRolesForUser = existingUserRoles.filter(
      (userRole) => userRole.userId === userId
    );

    const roles: Role[] = [];

    for (const userRole of userRolesForUser) {
      const role = await this.adapter.findById(userRole.roleId);

      if (role != null) roles.push(Role.factory(role.id, role.name));
    }

    return roles;
  }
}
