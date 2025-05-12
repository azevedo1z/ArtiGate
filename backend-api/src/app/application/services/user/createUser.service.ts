import { CreateUserDTO } from '../../dtos/user/createUser.dto';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/models/user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressService } from '../address/createAddress.service';
import { RoleRepository } from '../../../domain/repositories/role.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly createAddressService: CreateAddressService,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    data.password = await bcrypt.hash(data.password, 10);

    const existingUser = await this.repository.findByEmail(data.email);

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

    const userRecord = await this.repository.create(
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
      const existingRole = await this.roleRepository.findById(roleId);

      if (existingRole == null)
        throw new BadRequestException(
          `Role with ID "${roleId}" does not exist.`
        );
    }
  }
}
