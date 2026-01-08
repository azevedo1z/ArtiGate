import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from '../../dtos/user/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { User } from '../../../domain/models/user.model';
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

  async execute(data: UpdateUserDTO) {
    const existingUser = await this.adapter.findById(data.id);
    if (!existingUser)
      throw new NotFoundException(`User with ID "${data.id}" not found`);

    if (data.password) data.password = await bcrypt.hash(data.password, 10);

    const homeAddressId = await this.handleNewAddressCreation(data.homeAddress);
    const jobAddressId = await this.handleNewAddressCreation(data.jobAddress);
    const roleChanged = await this.validateRoles(data.roleIds);

    const userRecord = await this.adapter.update(
      data,
      homeAddressId,
      jobAddressId,
      roleChanged
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

  private async validateRoles(roleIds: string[]): Promise<boolean> {
    if (roleIds?.length) {
      for (const roleId of roleIds) {
        const role = await this.roleAdapter.findById(roleId);
        if (!role)
          throw new NotFoundException(`Role with ID "${roleId}" not found`);
      }
      return true;
    }
    return false;
  }

  private async handleNewAddressCreation(
    address: CreateAddressDTO
  ): Promise<string | undefined> {
    if (!address) return;

    const newAddress = await this.addressAdapter.create(address);
    return newAddress.id;
  }
}
