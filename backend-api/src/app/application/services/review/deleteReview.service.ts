import { Injectable } from '@nestjs/common';
import { Review } from '../../../domain/models/review.model';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async execute(requesterId: string, id: string): Promise<boolean> {
    const review = await this.adapter.findById(id);

    if (!review)
      throw new NotFoundException(`Review with ID "${id}" not found`);

    Review.assertOwnedBy(review.reviewerId, requesterId);

    return await this.adapter.deleteAndRecomputeArticleScore(
      id,
      review.articleId
    );
  }
}
