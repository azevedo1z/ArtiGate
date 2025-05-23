import { Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
import { UpdateRoleDTO } from '../../dtos/role/updateRole.dto';
import { RoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class UpdateRoleService {
  constructor(private readonly adapter: RoleDatabaseAdapter) {}

  async execute(data: UpdateRoleDTO): Promise<Role> {
    await this.adapter.findById(data.id);

    const roleRecord = await this.adapter.update(data);

    return Role.factory(roleRecord.id, roleRecord.name);
  }
}
