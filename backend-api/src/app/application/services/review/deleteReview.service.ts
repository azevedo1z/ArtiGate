import { Injectable } from '@nestjs/common';
import {
  ReviewDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteReviewService {
  constructor(
    private readonly adapter: ReviewDatabaseAdapter,
    private readonly userAdapter: UserDatabaseAdapter
  ) {}

  async execute(id: string): Promise<boolean> {
    const review = await this.adapter.findById(id);
    if (!review)
      throw new NotFoundException(`Review with ID "${id}" not found`);

    const reviewer = await this.userAdapter.findByReviewId?.(id);

    if (reviewer)
      throw new ConflictException('The review is associated with a user.');

    return await this.adapter.delete(id);
  }
}
