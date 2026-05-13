import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../../../interface/repositories/address.repository.port';
import { UserRepository } from '../../../interface/repositories/user.repository.port';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteAddressService {
  constructor(
    private readonly repo: AddressRepository,
    private readonly userRepo: UserRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    const address = await this.repo.findById(id);
    if (!address)
      throw new NotFoundException(`Address with ID "${id}" not found`);

    const user = await this.userRepo.findByAddressId(id);

    if (user && (user.homeAddressId === id || user.jobAddressId === id)) {
      throw new ConflictException('The address is associated with a user.');
    }

    return await this.repo.delete(id);
  }
}
