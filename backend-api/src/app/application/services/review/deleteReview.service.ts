import { Injectable } from '@nestjs/common';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async execute(id: string): Promise<boolean> {
    const review = await this.adapter.findById(id);

    if (!review)
      throw new NotFoundException(`Review with ID "${id}" not found`);

    return await this.adapter.delete(id);
  }
}
