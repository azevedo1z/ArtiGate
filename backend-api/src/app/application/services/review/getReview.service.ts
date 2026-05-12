import { Injectable } from '@nestjs/common';
import { Review } from '../../../domain/models/review.model';
import { reviewRowToDomain } from '../../mappers/review.mapper';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';
import { ReviewWithArticleSummary } from '../../../shared/types/review.types';
import {
  PaginatedResult,
  PaginationDTO,
  buildPaginatedResult,
  normalizePagination,
} from '../../../shared/dtos/pagination.dto';

@Injectable()
export class GetReviewService {
  constructor(private readonly adapter: ReviewDatabaseAdapter) {}

  async getById(id: string): Promise<Review> {
    const existingReview = await this.adapter.findById(id);

    if (!existingReview)
      throw new NotFoundException(`There is no review with the ID "${id}".`);

    return reviewRowToDomain(existingReview);
  }

  async getAll(pagination?: PaginationDTO): Promise<PaginatedResult<Review>> {
    const { page, limit } = normalizePagination(pagination);
    const [reviews, total] = await Promise.all([
      this.adapter.findAll(pagination),
      this.adapter.countAll?.() ?? Promise.resolve(0),
    ]);

    return buildPaginatedResult(
      reviews.map(reviewRowToDomain),
      total,
      page,
      limit
    );
  }

  async getByReviewerId(
    reviewerId: string
  ): Promise<ReviewWithArticleSummary[]> {
    const rows =
      (await this.adapter.findManyWithArticleByUserId?.(reviewerId)) ?? [];

    return rows.map((r) => ({
      id: r.id,
      articleId: r.articleId,
      reviewerId: r.reviewerId,
      score: r.score,
      commentary: r.commentary,
      article: r.article ? { id: r.article.id, summary: r.article.summary } : null,
    }));
  }

  async getByArticleId(articleId: string): Promise<Review[]> {
    const reviews = await this.adapter.findMany(articleId);
    return reviews.map(reviewRowToDomain);
  }
}
