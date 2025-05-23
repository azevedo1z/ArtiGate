import { BadRequestException, Injectable } from '@nestjs/common';
import { GetAddressService } from './getAddress.service';
import { GetUserService } from '../user/getUser.service';
import { AddressDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class DeleteAddressService {
  constructor(
    private readonly adapter: AddressDatabaseAdapter,
    private readonly getAddressService: GetAddressService,
    private readonly getUserService: GetUserService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getAddressService.getById(id);
    const user = await this.getUserService.getByAddressId(id);

    const hasConstraint = user.homeAddressId === id || user.jobAddressId === id;

    if (hasConstraint)
      throw new BadRequestException('The address is associated with a user.');

    return await this.adapter.delete(id);
  }
}
