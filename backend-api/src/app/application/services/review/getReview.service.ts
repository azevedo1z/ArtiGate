import { Injectable } from '@nestjs/common';
import { Review } from '../../../domain/models/review.model';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async getById(id: string) {
    const existingReview = await this.adapter.findById(id);

    if (!existingReview)
      throw new NotFoundException(`There is no review with the ID "${id}".`);

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

    if (!reviews || reviews.length == 0)
      throw new NotFoundException(
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
