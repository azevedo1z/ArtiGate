import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UpdateUserDTO } from '../../dtos/user/updateUser.dto';
import { GetUserService } from './getUser.service';
import { CreateAddressService } from '../address/createAddress.service';
import * as bcrypt from 'bcrypt';
import { RoleRepository } from '../../../domain/repositories/role.repository';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { User } from '../../../domain/models/user.model';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly getUserService: GetUserService,
    private readonly createAddressService: CreateAddressService,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(
    data: UpdateUserDTO,
    homeAddressData: CreateAddressDTO,
    jobAddressData: CreateAddressDTO
  ) {
    let homeAddressId: string | null = null;
    let jobAddressId: string | null = null;
    let roleChanged = false;

    await this.getUserService.getById(data.id);

    if (data.password != null)
      data.password = await bcrypt.hash(data.password, 10);

    if (data.roleIds != null) {
      roleChanged = true;
      for (const roleId of data.roleIds) {
        const existingRole = await this.roleRepository.findById(roleId);

        if (existingRole == null) {
          throw new BadRequestException(
            `Role with ID "${roleId}" does not exist.`
          );
        }
      }
    }

    if (data.homeAddress != null) {
      const { id: newHomeAddressId } = await this.createAddressService.execute(
        homeAddressData
      );
      homeAddressId = newHomeAddressId;
    }
    if (data.jobAddress != null) {
      const { id: newJobAddressId } = await this.createAddressService.execute(
        jobAddressData
      );
      jobAddressId = newJobAddressId;
    }

    const userRecord = await this.repository.update(
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
}
