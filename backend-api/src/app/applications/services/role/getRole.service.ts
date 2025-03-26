import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../../domain/repositories/role.repository';
import { Role } from '../../../domain/models/role.model';

@Injectable()
export class GetRoleService {
  constructor(private readonly repository: RoleRepository) {}

  async getById(id: string): Promise<Role | null> {
    const existingRole = await this.repository.findById(id);

    if (existingRole == null)
      throw new Error(`There is no role with the ID "${id}".`);

    return Role.factory(existingRole.id, existingRole.name);
  }

  async getAll(): Promise<Array<Role>> {
    const roles = await this.repository.findAll();

    return roles.map((existingRole) =>
      Role.factory(existingRole.id, existingRole.name)
    );
  }
}
