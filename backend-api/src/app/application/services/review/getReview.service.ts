import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../../domain/repositories/review.repository';
import { Review } from '../../../domain/models/review.model';

@Injectable()
export class GetReviewService {
  constructor(private readonly repository: ReviewRepository) {}

  async getBydId(id: string) {
    const existingReview = await this.repository.findById(id);

    if (existingReview == null) {
      throw new Error(`There is no review with the ID "${id}".`);
    }

    return existingReview;
  }

  async getAll() {
    const reviews = await this.repository.findAll();

    return reviews.map((existingReview) =>
      Review.factory(
        existingReview.id,
        existingReview.articleId,
        existingReview.reviewerId,
        existingReview.score,
        existingReview.commentary
      )
    );
  }
}
