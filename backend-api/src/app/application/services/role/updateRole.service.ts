import { Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
import { roleRowToDomain } from '../../mappers/role.mapper';
import { UpdateRoleDTO } from '../../dtos/role/updateRole.dto';
import { RoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateRoleService {
  constructor(private readonly adapter: RoleDatabaseAdapter) {}

  async execute(data: UpdateRoleDTO): Promise<Role> {
    const existingRole = await this.adapter.findById(data.id);
    if (!existingRole)
      throw new NotFoundException(`Role with ID "${data.id}" not found`);

    const roleRecord = await this.adapter.update(data);

    return roleRowToDomain(roleRecord);
  }
}
