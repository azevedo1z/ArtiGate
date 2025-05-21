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

  async getByAddressId(addressId: string): Promise<User> {
    const existingUser = await this.adapter.findByAddressId?.(addressId);

    if (existingUser == null)
      throw new BadRequestException(
        `There is no user with the addressId "${addressId}".`
      );

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

  async getByReviewId(reviewId: string): Promise<User> {
    const existingUser = await this.adapter.findByReviewId?.(reviewId);

    if (existingUser == null)
      throw new BadRequestException(
        `There is no user with the reviewId "${reviewId}".`
      );

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
}
