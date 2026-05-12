import { Injectable } from '@nestjs/common';
import {
  ValidationException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';
import { CreateReviewDTO } from '../../dtos/review/createReview.dto';
import { Review } from '../../../domain/models/review.model';
import { reviewRowToDomain } from '../../mappers/review.mapper';
import {
  ArticleAuthorDatabaseAdapter,
  ReviewDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';

@Injectable()
export class CreateReviewService {
  constructor(
    private readonly adapter: ReviewDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter
  ) {}

  async execute(requesterId: string, data: CreateReviewDTO): Promise<Review> {
    const authors = await this.articleAuthorAdapter.findMany(data.articleId);

    if (authors.some((a) => a.userId === requesterId))
      throw new ValidationException('Authors cannot review their own articles');

    const existingReviews = await this.adapter.findMany(data.articleId);

    if (existingReviews.some((r) => r.reviewerId === requesterId))
      throw new ConflictException('You have already reviewed this article');

    const reviewRecord = await this.adapter.createAndRecomputeArticleScore(
      { ...data, reviewerId: requesterId },
      data.articleId
    );

    return reviewRowToDomain(reviewRecord);
  }
}
