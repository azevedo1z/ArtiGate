import { Injectable } from '@nestjs/common';
import { Review } from '../../../domain/models/review.model';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';
import {
  PaginationDTO,
  buildPaginatedResult,
  normalizePagination,
} from '../../../shared/dtos/pagination.dto';

@Injectable()
export class GetReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async getById(id: string) {
    const existingReview = await this.adapter.findById(id);

    if (!existingReview)
      throw new NotFoundException(`There is no review with the ID "${id}".`);

    return existingReview;
  }

  async getAll(pagination?: PaginationDTO) {
    const { page, limit } = normalizePagination(pagination);
    const [reviews, total] = await Promise.all([
      this.adapter.findAll(pagination),
      this.adapter.countAll?.() ?? Promise.resolve(0),
    ]);

    const data = reviews.map((existingReview) =>
      Review.factory(
        existingReview.id,
        existingReview.articleId,
        existingReview.reviewerId,
        existingReview.score,
        existingReview.commentary
      )
    );

    return buildPaginatedResult(data, total, page, limit);
  }

  async getByReviewerId(reviewerId: string) {
    const reviews = await this.adapter.findManyByUserId?.(reviewerId);

    if (!reviews) return [];

    return reviews.map((existingReview) =>
      Review.factory(
        existingReview.id,
        existingReview.articleId,
        existingReview.reviewerId,
        existingReview.score,
        existingReview.commentary
      )
    );
  }

  async getByArticleId(articleId: string) {
    const reviews = await this.adapter.findMany(articleId);

    return reviews.map((existingReview) =>
      Review.factory(
        existingReview.id,
        existingReview.articleId,
        existingReview.reviewerId,
        existingReview.score,
        existingReview.commentary
      )
    );
  }
}
