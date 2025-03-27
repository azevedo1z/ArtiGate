import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../../domain/repositories/review.repository';
import { CreateReviewDTO } from '../../dtos/review/createReview.dto';
import { Review } from '../../../domain/models/review.model';

@Injectable()
export class CreateReviewService {
  constructor(private readonly repository: ReviewRepository) {}

  async execute(data: CreateReviewDTO): Promise<Review> {
    const reviewRecord = await this.repository.create(data);

    return Review.factory(
      reviewRecord.id,
      reviewRecord.articleId,
      reviewRecord.reviewerId,
      reviewRecord.score,
      reviewRecord.commentary
    );
  }
}
