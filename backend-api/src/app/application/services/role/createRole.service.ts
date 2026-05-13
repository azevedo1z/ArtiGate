import { Injectable } from '@nestjs/common';
import { CreateRoleDTO } from '../../dtos/role/createRole.dto';
import { Role } from '../../../domain/models/role.model';
import { RoleRepository } from '../../../interface/repositories/role.repository.port';
import { ConflictException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class CreateRoleService {
  constructor(private readonly repo: RoleRepository) {}

  async execute(data: CreateRoleDTO): Promise<Role> {
    const name = Role.normalizeName(data.name);

    const roleExists = await this.repo.findByName(name);
    if (roleExists)
      throw new ConflictException('There is already a role with this name.');

    Role.ensureInvariants({ id: '', name });

    return this.repo.create({ ...data, name });
  }
}
