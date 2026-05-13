import { Injectable } from '@nestjs/common';
import { Review } from '../../../domain/models/review.model';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
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
  constructor(private readonly repo: ReviewRepository) {}

  async getById(id: string): Promise<Review> {
    const existing = await this.repo.findById(id);

    if (!existing)
      throw new NotFoundException(`There is no review with the ID "${id}".`);

    return existing;
  }

  async getAll(pagination?: PaginationDTO): Promise<PaginatedResult<Review>> {
    const { page, limit } = normalizePagination(pagination);
    const [reviews, total] = await Promise.all([
      this.repo.findAll(pagination),
      this.repo.countAll(),
    ]);

    return buildPaginatedResult(reviews, total, page, limit);
  }

  async getByReviewerId(
    reviewerId: string
  ): Promise<ReviewWithArticleSummary[]> {
    return this.repo.findManyWithArticleByUserId(reviewerId);
  }

  async getByArticleId(articleId: string): Promise<Review[]> {
    return this.repo.findMany(articleId);
  }
}
