import { CreateUserDTO } from '../../dtos/user/createUser.dto';
import { User } from '../../../domain/models/user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressService } from '../address/createAddress.service';
import * as bcrypt from 'bcrypt';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { Role } from '@prisma/client';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly adapter: DatabaseAdapter<User>,
    private readonly createAddressService: CreateAddressService,
    private readonly roleAdapter: DatabaseAdapter<Role>
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    data.password = await bcrypt.hash(data.password, 10);

    const existingUser = await this.adapter.findBy(data.email);

    await this.validateRoles(data.roleIds);

    if (existingUser != null)
      throw new BadRequestException(
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
    for (const roleId of roleIds) {
      const existingRole = await this.roleAdapter.findBy(roleId);

      if (existingRole == null)
        throw new BadRequestException(
          `Role with ID "${roleId}" does not exist.`
        );
    }
  }
}
