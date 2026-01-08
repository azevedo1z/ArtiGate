import { Injectable } from '@nestjs/common';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { Review } from '../../../domain/models/review.model';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async execute(data: UpdateReviewDTO): Promise<Review> {
    const existingReview = await this.adapter.findById(data.id);
    if (!existingReview)
      throw new NotFoundException(`Review with ID "${data.id}" not found`);

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
