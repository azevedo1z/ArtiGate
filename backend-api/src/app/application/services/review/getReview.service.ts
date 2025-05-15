import {
  BadRequestException,
  Injectable
} from '@nestjs/common';
import { ReviewRepository } from '../../../infrastructure/repositories/review.repository';
import { Review } from '../../../domain/models/review.model';

@Injectable()
export class GetReviewService {
  constructor(private readonly repository: ReviewRepository) {}

  async getById(id: string) {
    const existingReview = await this.repository.findById(id);

    if (existingReview == null) {
      throw new BadRequestException(`There is no review with the ID "${id}".`);
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

  async getByUserId(userId: string) {
    const reviews = await this.repository.findByReviewerId(userId);

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
    const reviews = await this.repository.findByArticleId(articleId);

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
