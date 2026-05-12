import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import {
  ArticleDatabaseAdapter,
  ReviewDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly reviewAdapter: ReviewDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter
  ) {}

  async execute(requesterId: string, id: string): Promise<boolean> {
    const article = await this.adapter.findById(id);
    if (!article)
      throw new NotFoundException(`Article with ID "${id}" not found`);

    const authors = await this.articleAuthorAdapter.findMany(id);
    Article.assertAuthoredBy(
      authors.map((a) => a.userId),
      requesterId
    );

    const reviews = await this.reviewAdapter.findMany(id);
    if (reviews?.length)
      throw new ConflictException(
        'The article is associated with one or more reviews.'
      );

    return await this.adapter.delete(id);
  }
}
