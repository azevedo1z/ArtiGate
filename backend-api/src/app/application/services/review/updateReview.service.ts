import { Injectable } from '@nestjs/common';
import { GetReviewService } from './getReview.service';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { Review } from '../../../domain/models/review.model';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class UpdateReviewService {
  constructor(
    private readonly adapter: ReviewDatabaseAdapter,
    private readonly getReviewService: GetReviewService
  ) {}

  async execute(data: UpdateReviewDTO): Promise<Review> {
    await this.getReviewService.getById(data.id);

    const reviewRecord = await this.adapter.update(data);

    return Review.factory(
      reviewRecord.id,
      reviewRecord.articleId,
      reviewRecord.reviewerId,
      reviewRecord.score,
      reviewRecord.commentary
    );
  }
}
