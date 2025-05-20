import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../../domain/models/user.model';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class GetUserService {
  constructor(private readonly adapter: DatabaseAdapter<User>) {}

  async getById(id: string): Promise<User | null> {
    const existingUser = await this.adapter.findBy(id);

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

  async getByEmail(email: string): Promise<User> {
    const existingUser = await this.adapter.findBy(email);

    if (existingUser == null)
      throw new BadRequestException(
        `There is no user with the E-mail "${email}".`
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

  async getByAddressId(addressId: string): Promise<User> {
    const existingUser = await this.adapter.findBy(addressId);

    if (existingUser == null)
      throw new BadRequestException(
        `There is no user with the address Id "${addressId}".`
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
    if (!this.adapter.findByReviewId)
      throw new BadRequestException(
        'Database adapter is not properly configured.'
      );

    const reviewer = await this.adapter.findByReviewId(reviewId);

    if (reviewer == null)
      throw new BadRequestException(
        `There is no user with the review Id "${reviewId}".`
      );

    return User.factory(
      reviewer.id,
      reviewer.name,
      reviewer.email,
      reviewer.phone,
      reviewer.homeAddressId,
      reviewer.jobAddressId,
      reviewer.badgeUrl,
      reviewer.passwordHash
    );
  }
}
