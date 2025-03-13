import { CreateUserDTO } from '../../dtos/user/createUser.dto';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { User } from '../../../domain/models/user.model';
import { Injectable } from '@nestjs/common';
import { CreateAddressService } from '../address/createAddress.service';
import { RoleRepository } from '../../../domain/repositories/role.repository';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly createAddressService: CreateAddressService,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(
    data: CreateUserDTO,
    homeAddressData: CreateAddressDTO,
    jobAddressData: CreateAddressDTO
  ): Promise<User> {
    const userExists = await this.repository.findByEmail(data.email);

    for (const roleId of data.roleIds) {
      const roleExists = await this.roleRepository.findById(roleId);

      if (!roleExists) {
        throw new Error(`Role with ID ${roleId} does not exist.`);
      }
    }

    if (userExists)
      throw new Error('There is already a user with this e-mail.');

    const { id: homeAddressId } = await this.createAddressService.execute(
      homeAddressData
    );
    const { id: jobAddressId } = await this.createAddressService.execute(
      jobAddressData
    );

    const user = await this.repository.create(
      data,
      homeAddressId,
      jobAddressId
    );

    return User.factory(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.homeAddressId,
      user.jobAddressId,
      user.badgeUrl
    );
  }
}
