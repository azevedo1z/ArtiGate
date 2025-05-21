import { BadRequestException, Injectable } from '@nestjs/common';
import { Review } from '../../../domain/models/review.model';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class GetReviewService {
  constructor(private readonly adapter: DatabaseAdapter<Review>) {}

  async getById(id: string) {
    const existingReview = await this.adapter.findById(id);

    if (existingReview == null) {
      throw new BadRequestException(`There is no review with the ID "${id}".`);
    }

    return existingReview;
  }

  async getAll() {
    const reviews = await this.adapter.findAll();

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

  async getByReviewerId(reviewerId: string) {
    const reviews = await this.adapter.findManyByUserId?.(reviewerId);

    if (reviews == null || reviews.length == 0)
      throw new BadRequestException(
        `There is no review associated with the userId "${reviewerId}".`
      );

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

  async getByArticleId(articleId: string) {
    const reviews = await this.adapter.findMany(articleId);

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
