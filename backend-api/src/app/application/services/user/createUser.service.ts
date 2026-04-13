import { CreateUserDTO } from '../../dtos/user/createUser.dto';
import { User } from '../../../domain/models/user.model';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../../../shared/constants';
import {
  UserDatabaseAdapter,
  AddressDatabaseAdapter,
  RoleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  ConflictException,
  NotFoundException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly adapter: UserDatabaseAdapter,
    private readonly addressAdapter: AddressDatabaseAdapter,
    private readonly roleAdapter: RoleDatabaseAdapter
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    const existingUser = await this.adapter.findByEmail?.(data.email);
    if (existingUser)
      throw new ConflictException('There is already a user with this e-mail.');

    await this.validateRoles(data.roleIds);

    const homeAddress = await this.addressAdapter.create(data.homeAddress);
    const jobAddress = await this.addressAdapter.create(data.jobAddress);

    const userRecord = await this.adapter.create(
      data,
      homeAddress.id,
      jobAddress.id
    );

    return User.factory(
      userRecord.id,
      userRecord.name,
      userRecord.email,
      userRecord.phone,
      userRecord.homeAddressId,
      userRecord.jobAddressId,
      userRecord.badgeUrl,
      userRecord.passwordHash
    );
  }

  private async validateRoles(roleIds: string[]): Promise<void> {
    const roles = await this.roleAdapter.findByIds?.(roleIds) ?? [];
    if (roles.length !== roleIds.length) {
      const foundIds = new Set(roles.map((r) => r.id));
      const missing = roleIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Role(s) not found: ${missing.join(', ')}`);
    }
  }
}
