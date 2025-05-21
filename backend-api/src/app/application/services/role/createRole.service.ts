import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDTO } from '../../dtos/role/createRole.dto';
import { Role } from '../../../domain/models/role.model';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class CreateRoleService {
  constructor(private readonly adapter: DatabaseAdapter<Role>) {}

  async execute(data: CreateRoleDTO): Promise<Role> {
    if (!this.adapter.findByName)
      throw new BadRequestException(
        'The Database Adapter was not properly configured.'
      );

    const roleExists = await this.adapter.findByName(
      data.name.toUpperCase().trim()
    );

    if (roleExists)
      throw new BadRequestException('There is already a role with this name.');

    const roleRecord = await this.adapter.create(data);

    return Role.factory(roleRecord.id, roleRecord.name);
  }
}
