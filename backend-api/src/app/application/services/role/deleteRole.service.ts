import { BadRequestException } from '@nestjs/common';
import { RoleRepository } from '../../../domain/repositories/role.repository';
import { GetUserService } from '../user/getUser.service';
import { GetRoleService } from './getRole.service';

export class DeleteRoleService {
  constructor(
    private readonly repository: RoleRepository,
    private readonly getRoleService: GetRoleService,
    private readonly getUserService: GetUserService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getRoleService.getById(id);

    const participants = await this.getUserService.getAllRoles();

    const hasConstraint = participants.some(
      (participant) => participant.roleId === id
    );

    if (hasConstraint)
      throw new BadRequestException('The role is associated with a user.');

    return await this.repository.delete(id);
  }
}
