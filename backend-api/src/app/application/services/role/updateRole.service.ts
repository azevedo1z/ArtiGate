import { Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
import { UpdateRoleDTO } from '../../dtos/role/updateRole.dto';
import { RoleRepository } from '../../../interface/repositories/role.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateRoleService {
  constructor(private readonly repo: RoleRepository) {}

  async execute(data: UpdateRoleDTO): Promise<Role> {
    const existing = await this.repo.findById(data.id);
    if (!existing)
      throw new NotFoundException(`Role with ID "${data.id}" not found`);

    if (data.name !== undefined) data.name = Role.normalizeName(data.name);

    Role.ensureInvariants({
      id: existing.id,
      name: data.name ?? existing.name,
    });

    return this.repo.update(data);
  }
}
