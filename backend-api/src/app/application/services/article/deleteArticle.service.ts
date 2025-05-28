import { BadRequestException, Injectable } from '@nestjs/common';
import { GetArticleService } from './getArticle.service';
import { GetReviewService } from '../review/getReview.service';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { GetArticleAuthorService } from '../articleAuthor/getArticleAuthor.service';

@Injectable()
export class DeleteArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly getArticleService: GetArticleService,
    private readonly getReviewService: GetReviewService,
    private readonly getArticleAuthorService: GetArticleAuthorService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getArticleService.getById(id);

    let hasConstraint = false;

    const authors = await this.getArticleAuthorService.getByArticleId(id);
    const reviews = await this.getReviewService.getByArticleId(id);

    if (authors?.some((author) => author.articleId === id))
      hasConstraint = true;

    if (reviews?.some((reviewer) => reviewer.articleId === id))
      hasConstraint = true;

    if (hasConstraint)
      throw new BadRequestException(
        'The article is associated with a user or with a review.'
      );

    return await this.adapter.delete(id);
  }
}
