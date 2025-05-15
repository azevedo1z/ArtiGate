import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../../infrastructure/repositories/review.repository';
import { GetReviewService } from './getReview.service';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { Review } from '../../../domain/models/review.model';

@Injectable()
export class UpdateReviewService {
  constructor(
    private readonly repository: ReviewRepository,
    private readonly getReviewService: GetReviewService
  ) {}

  async execute(data: UpdateReviewDTO): Promise<Review> {
    await this.getReviewService.getById(data.id);

    const reviewRecord = await this.repository.update(data);

    return Review.factory(
      reviewRecord.id,
      reviewRecord.articleId,
      reviewRecord.reviewerId,
      reviewRecord.score,
      reviewRecord.commentary
    );
  }
}
