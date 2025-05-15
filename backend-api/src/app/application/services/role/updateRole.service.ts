import { Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
import { RoleRepository } from '../../../infrastructure/repositories/role.repository';
import { UpdateRoleDTO } from '../../dtos/role/updateRole.dto';

@Injectable()
export class UpdateRoleService {
  constructor(private readonly repository: RoleRepository) {}

  async execute(data: UpdateRoleDTO): Promise<Role> {
    await this.repository.findById(data.id);

    const roleRecord = await this.repository.update(data);

    return Role.factory(roleRecord.id, roleRecord.name);
  }
}
