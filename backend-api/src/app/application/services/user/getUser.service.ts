import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../../domain/models/user.model';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class GetUserService {
  constructor(private readonly adapter: DatabaseAdapter<User>) {}

  async getById(id: string): Promise<User | null> {
    const existingUser = await this.adapter.findById(id);

    if (existingUser == null)
      throw new BadRequestException(`There is no user with the ID "${id}".`);

    return User.factory(
      existingUser.id,
      existingUser.name,
      existingUser.email,
      existingUser.phone,
      existingUser.homeAddressId,
      existingUser.jobAddressId,
      existingUser.badgeUrl,
      existingUser.passwordHash
    );
  }

  async getAll(): Promise<User[]> {
    const users = await this.adapter.findAll();

    return users.map((existingUser) =>
      User.factory(
        existingUser.id,
        existingUser.name,
        existingUser.email,
        existingUser.phone,
        existingUser.homeAddressId,
        existingUser.jobAddressId,
        existingUser.badgeUrl,
        existingUser.passwordHash
      )
    );
  }
}
