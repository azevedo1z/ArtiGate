import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from '../../dtos/user/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../../../shared/constants';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { User } from '../../../domain/models/user.model';
import { Address } from '../../../domain/models/address.model';
import { userRowToDomain } from '../../mappers/user.mapper';
import {
  UserDatabaseAdapter,
  AddressDatabaseAdapter,
  RoleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly adapter: UserDatabaseAdapter,
    private readonly addressAdapter: AddressDatabaseAdapter,
    private readonly roleAdapter: RoleDatabaseAdapter
  ) {}

  async execute(data: UpdateUserDTO): Promise<User> {
    const existing = await this.adapter.findById(data.id);
    if (!existing)
      throw new NotFoundException(`User with ID "${data.id}" not found`);

    User.ensureInvariants({
      id: existing.id,
      name: data.name ?? existing.name,
      email: data.email ?? existing.email,
      phone: data.phone ?? existing.phone,
      badgeUrl: data.badgeUrl ?? existing.badgeUrl,
      homeAddressId: existing.homeAddressId,
      jobAddressId: existing.jobAddressId,
      passwordHash: existing.passwordHash,
    });

    if (data.password)
      data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    const homeAddressId = await this.handleNewAddressCreation(data.homeAddress);
    const jobAddressId = await this.handleNewAddressCreation(data.jobAddress);
    const roleChanged = await this.validateRoles(data.roleIds);

    const userRecord = await this.adapter.update(
      data,
      homeAddressId,
      jobAddressId,
      roleChanged
    );

    return userRowToDomain(userRecord);
  }

  private async validateRoles(roleIds: string[]): Promise<boolean> {
    if (roleIds?.length) {
      const roles = (await this.roleAdapter.findByIds?.(roleIds)) ?? [];
      if (roles.length !== roleIds.length) {
        const foundIds = new Set(roles.map((r) => r.id));
        const missing = roleIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(`Role(s) not found: ${missing.join(', ')}`);
      }
      return true;
    }
    return false;
  }

  private async handleNewAddressCreation(
    address: CreateAddressDTO
  ): Promise<string | undefined> {
    if (!address) return;

    Address.ensureInvariants({ id: '', ...address });

    const newAddress = await this.addressAdapter.create(address);
    return newAddress.id;
  }
}
