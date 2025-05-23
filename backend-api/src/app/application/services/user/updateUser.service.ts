import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from '../../dtos/user/updateUser.dto';
import { GetUserService } from './getUser.service';
import { CreateAddressService } from '../address/createAddress.service';
import * as bcrypt from 'bcrypt';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { User } from '../../../domain/models/user.model';
import { UserDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { GetRoleService } from '../role/getRole.service';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly adapter: UserDatabaseAdapter,
    private readonly getUserService: GetUserService,
    private readonly createAddressService: CreateAddressService,
    private readonly getRoleService: GetRoleService
  ) {}

  async execute(data: UpdateUserDTO) {
    await this.getUserService.getById(data.id);

    if (data.password != null)
      data.password = await bcrypt.hash(data.password, 10);

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
    if (roleIds != null) {
      for (const roleId of roleIds) await this.getRoleService.getById(roleId);
      return true;
    }
    return false;
  }

  private async handleNewAddressCreation(address: CreateAddressDTO) {
    if (address === null) return;

    const { id: newAddressId } = await this.createAddressService.execute(
      address
    );

    return newAddressId;
  }
}
