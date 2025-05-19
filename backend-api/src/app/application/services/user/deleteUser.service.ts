import { BadRequestException, Injectable } from '@nestjs/common';
import { GetUserService } from './getUser.service';
import { GetReviewService } from '../review/getReview.service';
import { GetArticleService } from '../article/getArticle.service';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { User } from '../../../domain/models/user.model';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly adapter: DatabaseAdapter<User>,
    private readonly getUserService: GetUserService,
    private readonly getReviewService: GetReviewService,
    private readonly getArticleService: GetArticleService
  ) {}
  async execute(id: string): Promise<boolean> {
    await this.getUserService.getById(id);

    await this.validateConstraints(id);

    return true;
  }

  private async validateConstraints(id: string) {
    let hasConstraint = false;

    const reviews = await this.getReviewService.getByUserId(id);
    const articles = await this.getArticleService.getAuthorsByArticleId(id);

    if (reviews?.some((review) => review.reviewerId === id))
      hasConstraint = true;

    if (articles?.some((article) => article.userId === id))
      hasConstraint = true;

    if (hasConstraint)
      throw new BadRequestException(
        'The user is associated with a review or an articles.'
      );

    return await this.adapter.delete(id);
  }
}
