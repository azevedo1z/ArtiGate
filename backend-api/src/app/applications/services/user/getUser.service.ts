import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/models/user.model';

@Injectable()
export class GetUserService {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    const existingUser = await this.repository.findById(id);

    if (existingUser == null)
      throw new Error(`There is no user with the ID "${id}".`);

    return User.factory(
      existingUser.id,
      existingUser.name,
      existingUser.email,
      existingUser.phone,
      existingUser.homeAddressId,
      existingUser.jobAddressId,
      existingUser.badgeUrl
    );
  }
}
