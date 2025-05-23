import { Injectable } from '@nestjs/common';
import { CreateReviewDTO } from '../../dtos/review/createReview.dto';
import { Review } from '../../../domain/models/review.model';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class CreateReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async execute(data: CreateReviewDTO): Promise<Review> {
    const reviewRecord = await this.adapter.create(data);

    return Review.factory(
      reviewRecord.id,
      reviewRecord.articleId,
      reviewRecord.reviewerId,
      reviewRecord.score,
      reviewRecord.commentary
    );
  }
}
