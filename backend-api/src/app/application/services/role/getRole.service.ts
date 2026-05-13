import { Injectable } from '@nestjs/common';
import { Role } from '../../../domain/models/role.model';
import { RoleRepository } from '../../../interface/repositories/role.repository.port';
import { UserRoleRepository } from '../../../interface/repositories/userRole.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetRoleService {
  constructor(
    private readonly repo: RoleRepository,
    private readonly userRoleRepo: UserRoleRepository
  ) {}

  async getById(id: string): Promise<Role> {
    const existing = await this.repo.findById(id);

    if (!existing)
      throw new NotFoundException(`There is no role with the ID "${id}".`);

    return existing;
  }

  async getAll(): Promise<Role[]> {
    return this.repo.findAll();
  }

  async getRoleByUserId(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleRepo.findManyByUserId(userId);

    if (!userRoles.length) return [];

    const roleIds = userRoles.map((ur) => ur.roleId);
    return this.repo.findByIds(roleIds);
  }
}
