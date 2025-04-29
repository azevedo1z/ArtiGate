import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressRepository } from '../../../domain/repositories/address.repository';
import { GetAddressService } from './getAddress.service';
import { GetUserService } from '../user/getUser.service';

@Injectable()
export class DeleteAddressService {
  constructor(
    private readonly repository: AddressRepository,
    private readonly getAddressService: GetAddressService,
    private readonly getUserService: GetUserService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getAddressService.getById(id);
    const users = await this.getUserService.getByAddressId(id);

    const hasConstraint =
      users?.some(
        (user) => user.homeAddressId === id || user.jobAddressId === id
      ) ?? false;

    if (hasConstraint)
      throw new BadRequestException('The address is associated with a user.');

    return await this.repository.delete(id);
  }
}
