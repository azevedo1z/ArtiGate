import { Injectable } from '@nestjs/common';
import {
  RoleDatabaseAdapter,
  UserRoleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteRoleService {
  constructor(
    private readonly adapter: RoleDatabaseAdapter,
    private readonly userRoleAdapter: UserRoleDatabaseAdapter
  ) {}

  async execute(id: string): Promise<boolean> {
    const role = await this.adapter.findById(id);
    if (!role) throw new NotFoundException(`Role with ID "${id}" not found`);

    const constraintCount = await this.userRoleAdapter.countByField?.('roleId', id) ?? 0;
    const hasConstraint = constraintCount > 0;

    if (hasConstraint)
      throw new ConflictException(
        'The role is associated with one or more users.'
      );

    return await this.adapter.delete(id);
  }
}
