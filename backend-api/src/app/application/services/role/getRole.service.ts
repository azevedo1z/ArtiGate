import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
import { RoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { GetUserRoleService } from '../userRole/getUserRole.service';

@Injectable()
export class GetRoleService {
  constructor(
    private readonly adapter: RoleDatabaseAdapter,
    private readonly getUserRoleService: GetUserRoleService
  ) {}

  async getById(id: string): Promise<Role | null> {
    const existingRole = await this.adapter.findById(id);

    if (existingRole == null)
      throw new BadRequestException(`There is no role with the ID "${id}".`);

    return Role.factory(existingRole.id, existingRole.name);
  }

  async getAll(): Promise<Role[]> {
    const roles = await this.adapter.findAll();

    return roles.map((existingRole) =>
      Role.factory(existingRole.id, existingRole.name)
    );
  }

  async getRoleByUserId(userId: string): Promise<Role[]> {
    const existingUserRoles = await this.getUserRoleService.getByUserId(userId);

    const roles: Role[] = [];

    for (const userRole of existingUserRoles) {
      const role = await this.adapter.findById(userRole.roleId);

      if (role != null) roles.push(Role.factory(role.id, role.name));
    }

    return roles;
  }
}
