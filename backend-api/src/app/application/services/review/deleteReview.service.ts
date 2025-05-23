import { BadRequestException, Injectable } from '@nestjs/common';
import { GetReviewService } from './getReview.service';
import { GetUserService } from '../user/getUser.service';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class DeleteReviewService {
  constructor(
    private readonly adapter: ReviewDatabaseAdapter,
    private readonly getReviewService: GetReviewService,
    private readonly getUserService: GetUserService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getReviewService.getById(id);

    const reviewer = await this.getUserService.getByReviewId(id);

    const hasConstraint = !!reviewer;

    if (hasConstraint)
      throw new BadRequestException('The review is associated with a user.');

    return await this.adapter.delete(id);
  }
}
