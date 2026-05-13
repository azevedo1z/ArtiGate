import { Injectable } from '@nestjs/common';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { Review } from '../../../domain/models/review.model';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateReviewService {
  constructor(private readonly repo: ReviewRepository) {}

  async execute(requesterId: string, data: UpdateReviewDTO): Promise<Review> {
    const existing = await this.repo.findById(data.id);

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

    if (data.score === undefined) return this.repo.update(data);

    return this.repo.updateAndRecomputeArticleScore(data, existing.articleId);
  }
}
