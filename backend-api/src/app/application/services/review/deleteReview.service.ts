import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../../domain/repositories/review.repository';
import { GetReviewService } from './getReview.service';
import { GetUserService } from '../user/getUser.service';

@Injectable()
export class DeleteReviewService {
  constructor(
    private readonly repository: ReviewRepository,
    private readonly getReviewService: GetReviewService,
    private readonly getUserService: GetUserService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getReviewService.getById(id);

    const reviewers = await this.getUserService.getByReviewId(id);

    const hasConstraint =
      reviewers?.some((reviewer) => reviewer.id === id) ?? false;

    if (hasConstraint)
      throw new BadRequestException('The review is associated with a user.');

    return await this.repository.delete(id);
  }
}
