import { Injectable } from '@nestjs/common';
import {
  UserDatabaseAdapter,
  ReviewDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly adapter: UserDatabaseAdapter,
    private readonly reviewAdapter: ReviewDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter
  ) {}

  async execute(id: string): Promise<boolean> {
    const user = await this.adapter.findById(id);
    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);

    await this.validateConstraints(id);

    await this.adapter.delete(id);
    return true;
  }

  private async validateConstraints(id: string) {
    const reviews = await this.reviewAdapter.findMany(id);

    const articles = await this.articleAuthorAdapter.findManyByUserId?.(id);

    if (reviews?.length)
      throw new ConflictException(
        'The user is associated with one or more reviews.'
      );

    if (articles?.length)
      throw new ConflictException(
        'The user is associated with one or more articles.'
      );
  }
}
