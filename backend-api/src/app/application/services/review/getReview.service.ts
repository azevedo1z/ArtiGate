import { BadRequestException, Injectable } from '@nestjs/common';
import { Review } from '../../../domain/models/review.model';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class GetReviewService {
  constructor(private readonly adapter: DatabaseAdapter<Review>) {}

  async getById(id: string) {
    const existingReview = await this.adapter.findBy(id);

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

  async getByUserId(userId: string) {
    const reviews = await this.adapter.findManyBy(userId);

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
    const reviews = await this.adapter.findManyBy(articleId);

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
