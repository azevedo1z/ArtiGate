import { Injectable } from '@nestjs/common';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { Review } from '../../../domain/models/review.model';
import { reviewRowToDomain } from '../../mappers/review.mapper';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async execute(requesterId: string, data: UpdateReviewDTO): Promise<Review> {
    const existingReview = await this.adapter.findById(data.id);

    if (!existingReview)
      throw new NotFoundException(`Review with ID "${data.id}" not found`);

    if (existingReview.reviewerId !== requesterId)
      throw new UnauthorizedException(
        'You can only update your own reviews.'
      );

    if (data.score === undefined) {
      const reviewRecord = await this.adapter.update(data);
      return reviewRowToDomain(reviewRecord);
    }

    const reviewRecord = await this.adapter.updateAndRecomputeArticleScore(
      data,
      existingReview.articleId
    );

    return reviewRowToDomain(reviewRecord);
  }
}
