import { CreateUserDTO } from '../../dtos/user/createUser.dto';
import { UserRepository } from '../../../domain/repositories/user.repository'
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { User } from '../../../domain/models/user.model'
import { Injectable } from '@nestjs/common';
import { CreateAddressService } from '../address/createAddress.service';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly createAddressService: CreateAddressService
  ) {}

  async execute(
    userData: CreateUserDTO,
    homeAddressData: CreateAddressDTO,
    jobAddressData: CreateAddressDTO
  ): Promise<User> {
    const userExists = await this.repository.findByEmail(userData.email);

    if (userExists)
      throw new Error('There is already a user with this e-mail.');

    const { id: homeAddressId } = await this.createAddressService.execute(
      homeAddressData
    );
    const {id: jobAddressId } = await this.createAddressService.execute(
      jobAddressData
    );

    const userRecord = await this.repository.create(userData, homeAddressId, jobAddressId);

    return User.factory(
      userRecord.id,
      userRecord.name,
      userRecord.email,
      userRecord.phone,
      userRecord.homeAddressId,
      userRecord.jobAddressId,
      userRecord.badgeUrl
    );
  }
}