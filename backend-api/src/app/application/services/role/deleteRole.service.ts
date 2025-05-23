import { BadRequestException, Injectable } from '@nestjs/common';
import { GetRoleService } from './getRole.service';
import { RoleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { GetUserRoleService } from '../user/getUserRole.service';

@Injectable()
export class DeleteRoleService {
  constructor(
    private readonly adapter: RoleDatabaseAdapter,
    private readonly getRoleService: GetRoleService,
    private readonly getUserRoleService: GetUserRoleService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getRoleService.getById(id);

    const participants = await this.getUserRoleService.getAllRoles();

    const hasConstraint = participants.some(
      (participant) => participant.roleId === id
    );

    if (hasConstraint)
      throw new BadRequestException('The role is associated with a user.');

    return await this.adapter.delete(id);
  }
}
