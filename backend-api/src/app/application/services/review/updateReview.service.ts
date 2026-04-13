import { Injectable } from '@nestjs/common';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import { Review } from '../../../domain/models/review.model';
import {
  ArticleDatabaseAdapter,
  ReviewDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateReviewService {
  constructor(
    private readonly adapter: ReviewDatabaseAdapter,
    private readonly articleAdapter: ArticleDatabaseAdapter
  ) {}

  async execute(data: UpdateReviewDTO): Promise<Review> {
    const existingReview = await this.adapter.findById(data.id);

    if (!existingReview)
      throw new NotFoundException(`Review with ID "${data.id}" not found`);

    const reviewRecord = await this.adapter.update(data);

    if (data.score !== undefined) {
      const allReviews = await this.adapter.findMany(reviewRecord.articleId);

      const scoreAvg =
        allReviews.reduce((sum, r) => sum + r.score, 0) / allReviews.length;

      const updateDto = new UpdateArticleDTO(
        reviewRecord.articleId,
        undefined,
        undefined,
        scoreAvg
      );

      await this.articleAdapter.update(updateDto);
    }

    return Review.factory(
      reviewRecord.id,
      reviewRecord.articleId,
      reviewRecord.reviewerId,
      reviewRecord.score,
      reviewRecord.commentary
    );
  }
}
