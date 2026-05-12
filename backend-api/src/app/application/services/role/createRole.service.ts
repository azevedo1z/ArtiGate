import { Injectable } from '@nestjs/common';
import { CreateRoleDTO } from '../../dtos/role/createRole.dto';
import { Role } from '../../../domain/models/role.model';
import { roleRowToDomain } from '../../mappers/role.mapper';
import { RoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { ConflictException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class CreateRoleService {
  constructor(private readonly adapter: RoleDatabaseAdapter) {}

  async execute(data: CreateRoleDTO): Promise<Role> {
    const name = Role.normalizeName(data.name);

    const roleExists = await this.adapter.findByName?.(name);
    if (roleExists)
      throw new ConflictException('There is already a role with this name.');

    Role.ensureInvariants({ id: '', name });

    const roleRecord = await this.adapter.create({ ...data, name });

    return roleRowToDomain(roleRecord);
  }
}
