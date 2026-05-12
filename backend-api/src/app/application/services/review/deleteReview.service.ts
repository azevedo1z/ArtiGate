import { Injectable } from '@nestjs/common';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async execute(requesterId: string, id: string): Promise<boolean> {
    const review = await this.adapter.findById(id);

    if (!review)
      throw new NotFoundException(`Review with ID "${id}" not found`);

    if (review.reviewerId !== requesterId)
      throw new UnauthorizedException(
        'You can only delete your own reviews.'
      );

    return await this.adapter.deleteAndRecomputeArticleScore(
      id,
      review.articleId
    );
  }
}
