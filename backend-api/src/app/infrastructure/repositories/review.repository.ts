import { Review as ReviewRow } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Review } from '../../domain/models/review.model';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';
import { ReviewRepository } from '../../interface/repositories/review.repository.port';
import { ReviewWithArticleSummary } from '../../shared/types/review.types';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

const rowToDomain = (row: ReviewRow): Review =>
  Review.factory({
    id: row.id,
    articleId: row.articleId,
    reviewerId: row.reviewerId,
    score: row.score,
    commentary: row.commentary,
  });

@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDTO & { reviewerId: string }): Promise<Review> {
    const row = await this.prisma.review.create({ data });
    return rowToDomain(row);
  }

  async update(data: UpdateReviewDTO): Promise<Review> {
    const { id, ...rest } = data;
    const row = await this.prisma.review.update({
      where: { id },
      data: rest,
    });
    return rowToDomain(row);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.review.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<Review | null> {
    const row = await this.prisma.review.findFirst({ where: { id } });
    return row ? rowToDomain(row) : null;
  }

  async findAll(pagination?: PaginationDTO): Promise<Review[]> {
    const { skip, take } = normalizePagination(pagination);
    const rows = await this.prisma.review.findMany({
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
    return rows.map(rowToDomain);
  }

  async countAll(): Promise<number> {
    return this.prisma.review.count();
  }

  async findMany(articleId: string): Promise<Review[]> {
    const rows = await this.prisma.review.findMany({ where: { articleId } });
    return rows.map(rowToDomain);
  }

  async findManyByUserId(reviewerId: string): Promise<Review[]> {
    const rows = await this.prisma.review.findMany({ where: { reviewerId } });
    return rows.map(rowToDomain);
  }

  async findManyWithArticleByUserId(
    reviewerId: string
  ): Promise<ReviewWithArticleSummary[]> {
    const rows = await this.prisma.review.findMany({
      where: { reviewerId },
      include: { article: { select: { id: true, summary: true } } },
      orderBy: { createdOn: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      articleId: r.articleId,
      reviewerId: r.reviewerId,
      score: r.score,
      commentary: r.commentary,
      article: r.article
        ? { id: r.article.id, summary: r.article.summary }
        : null,
    }));
  }

  async createAndRecomputeArticleScore(
    reviewData: CreateReviewDTO & { reviewerId: string },
    articleId: string
  ): Promise<Review> {
    const row = await this.prisma.$transaction(async (tx) => {
      const reviewRecord = await tx.review.create({ data: reviewData });
      const { _avg } = await tx.review.aggregate({
        where: { articleId },
        _avg: { score: true },
      });
      await tx.article.update({
        where: { id: articleId },
        data: { scoreAvg: _avg.score ?? 0 },
      });
      return reviewRecord;
    });
    return rowToDomain(row);
  }

  async updateAndRecomputeArticleScore(
    reviewData: UpdateReviewDTO,
    articleId: string
  ): Promise<Review> {
    const { id, ...rest } = reviewData;
    const row = await this.prisma.$transaction(async (tx) => {
      const reviewRecord = await tx.review.update({
        where: { id },
        data: rest,
      });
      const { _avg } = await tx.review.aggregate({
        where: { articleId },
        _avg: { score: true },
      });
      await tx.article.update({
        where: { id: articleId },
        data: { scoreAvg: _avg.score ?? 0 },
      });
      return reviewRecord;
    });
    return rowToDomain(row);
  }

  async deleteAndRecomputeArticleScore(
    reviewId: string,
    articleId: string
  ): Promise<boolean> {
    await this.prisma.$transaction(async (tx) => {
      await tx.review.update({
        where: { id: reviewId },
        data: { deletedOn: new Date() },
      });
      const { _avg } = await tx.review.aggregate({
        where: { articleId },
        _avg: { score: true },
      });
      await tx.article.update({
        where: { id: articleId },
        data: { scoreAvg: _avg.score ?? 0 },
      });
    });
    return true;
  }
}
