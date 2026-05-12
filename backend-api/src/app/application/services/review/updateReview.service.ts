import { Injectable } from '@nestjs/common';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { Review } from '../../../domain/models/review.model';
import { reviewRowToDomain } from '../../mappers/review.mapper';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async execute(requesterId: string, data: UpdateReviewDTO): Promise<Review> {
    const existing = await this.adapter.findById(data.id);

    if (!existing)
      throw new NotFoundException(`Review with ID "${data.id}" not found`);

    Review.assertOwnedBy(existing.reviewerId, requesterId);

    Review.ensureInvariants({
      id: existing.id,
      articleId: existing.articleId,
      reviewerId: existing.reviewerId,
      score: data.score ?? existing.score,
      commentary: data.commentary ?? existing.commentary,
    });

    if (data.score === undefined) {
      const reviewRecord = await this.adapter.update(data);
      return reviewRowToDomain(reviewRecord);
    }

    const reviewRecord = await this.adapter.updateAndRecomputeArticleScore(
      data,
      existing.articleId
    );

    return reviewRowToDomain(reviewRecord);
  }
}
