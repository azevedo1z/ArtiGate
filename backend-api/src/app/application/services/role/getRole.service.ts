import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
import { RoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class GetRoleService {
  constructor(private readonly adapter: RoleDatabaseAdapter) {}

  async getById(id: string): Promise<Role | null> {
    const existingRole = await this.adapter.findById(id);

    if (existingRole == null)
      throw new BadRequestException(`There is no role with the ID "${id}".`);
    // for testing
    // '5a3bbe8f-aa90-412d-94b2-602682f55d87'
    return Role.factory(existingRole.id, existingRole.name);
  }

  async getAll(): Promise<Role[]> {
    const roles = await this.adapter.findAll();

    return roles.map((existingRole) =>
      Role.factory(existingRole.id, existingRole.name)
    );
  }
}
