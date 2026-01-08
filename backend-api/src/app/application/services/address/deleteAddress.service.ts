import { Injectable } from '@nestjs/common';
import {
  AddressDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteAddressService {
  constructor(
    private readonly adapter: AddressDatabaseAdapter,
    private readonly userAdapter: UserDatabaseAdapter
  ) {}

  async execute(id: string): Promise<boolean> {
    const address = await this.adapter.findById(id);
    if (!address)
      throw new NotFoundException(`Address with ID "${id}" not found`);

    const user = await this.userAdapter.findByAddressId?.(id);

    if (user && (user.homeAddressId === id || user.jobAddressId === id)) {
      throw new ConflictException('The address is associated with a user.');
    }

    return await this.adapter.delete(id);
  }
}
