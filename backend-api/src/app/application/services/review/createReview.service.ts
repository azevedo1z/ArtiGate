import { Injectable } from '@nestjs/common';
import {
  ValidationException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';
import { CreateReviewDTO } from '../../dtos/review/createReview.dto';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import { Review } from '../../../domain/models/review.model';
import {
  ArticleAuthorDatabaseAdapter,
  ArticleDatabaseAdapter,
  ReviewDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';

@Injectable()
export class CreateReviewService {
  constructor(
    private readonly adapter: ReviewDatabaseAdapter,
    private readonly articleAdapter: ArticleDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter
  ) {}

  async execute(data: CreateReviewDTO): Promise<Review> {
    const authors = await this.articleAuthorAdapter.findMany(data.articleId);

    if (authors.some((a) => a.userId === data.reviewerId))
      throw new ValidationException('Authors cannot review their own articles');

    const existingReviews = await this.adapter.findMany(data.articleId);

    if (existingReviews.some((r) => r.reviewerId === data.reviewerId))
      throw new ConflictException('You have already reviewed this article');

    const reviewRecord = await this.adapter.create(data);

    const allReviews = [...existingReviews, reviewRecord];

    const scoreAvg =
      allReviews.reduce((sum, r) => sum + r.score, 0) / allReviews.length;

    const updateDto = new UpdateArticleDTO(
      data.articleId,
      undefined,
      undefined,
      scoreAvg
    );

    await this.articleAdapter.update(updateDto);

    return Review.factory(
      reviewRecord.id,
      reviewRecord.articleId,
      reviewRecord.reviewerId,
      reviewRecord.score,
      reviewRecord.commentary
    );
  }
}
