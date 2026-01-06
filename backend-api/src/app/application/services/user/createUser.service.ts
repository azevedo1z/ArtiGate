import { CreateUserDTO } from '../../dtos/user/createUser.dto';
import { User } from '../../../domain/models/user.model';
import { Injectable } from '@nestjs/common';
import { CreateAddressService } from '../address/createAddress.service';
import * as bcrypt from 'bcrypt';
import { UserDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { GetRoleService } from '../role/getRole.service';
import { GetUserService } from './getUser.service';
import { ConflictException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly adapter: UserDatabaseAdapter,
    private readonly createAddressService: CreateAddressService,
    private readonly getRoleService: GetRoleService,
    private readonly getUserService: GetUserService
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    data.password = await bcrypt.hash(data.password, 10);

    const existingUser = await this.getUserService.getByEmail(data.email);

    await this.validateRoles(data.roleIds);

    if (existingUser != null)
      throw new ConflictException(
        'There is already a user with this e-mail.'
      );

    const { id: homeAddressId } = await this.createAddressService.execute(
      data.homeAddress
    );
    const { id: jobAddressId } = await this.createAddressService.execute(
      data.jobAddress
    );

    const userRecord = await this.adapter.create(
      data,
      homeAddressId,
      jobAddressId
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

  private async validateRoles(roleIds: string[]) {
    for (const roleId of roleIds) await this.getRoleService.getById(roleId);
  }
}
