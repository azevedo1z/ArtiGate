import { Injectable } from '@nestjs/common';
import { Review } from '../../../domain/models/review.model';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteReviewService {
  constructor(private readonly repo: ReviewRepository) {}

  async execute(requesterId: string, id: string): Promise<boolean> {
    const review = await this.repo.findById(id);

    if (!review)
      throw new NotFoundException(`Review with ID "${id}" not found`);

    Review.assertOwnedBy(review.reviewerId, requesterId);

    return this.repo.deleteAndRecomputeArticleScore(id, review.articleId);
  }
}
