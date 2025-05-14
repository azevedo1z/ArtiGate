import { BadRequestException, Injectable } from '@nestjs/common';
import { ArticleRepository } from '../../../domain/repositories/article.repository';
import { GetArticleService } from './getArticle.service';
import { GetUserService } from '../user/getUser.service';
import { GetReviewService } from '../review/getReview.service';

@Injectable()
export class DeleteArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly getArticleService: GetArticleService,
    private readonly getUserService: GetUserService,
    private readonly getReviewService: GetReviewService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getArticleService.getById(id);

    let hasConstraint = false;

    const authors = await this.getUserService.getByArticleId(id);
    const reviews = await this.getReviewService.getByArticleId(id);

    if (authors?.some((author) => author.articleId === id))
      hasConstraint = true;

    if (reviews?.some((reviewer) => reviewer.articleId === id))
      hasConstraint = true;

    if (hasConstraint)
      throw new BadRequestException(
        'The article is associated with a user or with a review.'
      );

    return await this.articleRepository.delete(id);
  }
}
