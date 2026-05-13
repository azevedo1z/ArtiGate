import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../../interface/repositories/role.repository.port';
import { UserRoleRepository } from '../../../interface/repositories/userRole.repository.port';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteRoleService {
  constructor(
    private readonly repo: RoleRepository,
    private readonly userRoleRepo: UserRoleRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    const role = await this.repo.findById(id);
    if (!role) throw new NotFoundException(`Role with ID "${id}" not found`);

    const constraintCount = await this.userRoleRepo.countByField('roleId', id);

    if (constraintCount > 0)
      throw new ConflictException(
        'The role is associated with one or more users.'
      );

    return await this.repo.delete(id);
  }
}
