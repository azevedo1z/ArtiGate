import { Review } from '../../domain/models/review.model';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';
import { ReviewWithArticleSummary } from '../../shared/types/review.types';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';

export abstract class ReviewRepository {
  abstract create(data: CreateReviewDTO & { reviewerId: string }): Promise<Review>;
  abstract update(data: UpdateReviewDTO): Promise<Review>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Review | null>;
  abstract findAll(pagination?: PaginationDTO): Promise<Review[]>;
  abstract countAll(): Promise<number>;
  abstract findMany(articleId: string): Promise<Review[]>;
  abstract findManyByUserId(reviewerId: string): Promise<Review[]>;
  abstract findManyWithArticleByUserId(
    reviewerId: string
  ): Promise<ReviewWithArticleSummary[]>;

  // Triggering action is a review write; the article scoreAvg update is a
  // downstream consequence, applied atomically inside a transaction.
  abstract createAndRecomputeArticleScore(
    reviewData: CreateReviewDTO & { reviewerId: string },
    articleId: string
  ): Promise<Review>;

  abstract updateAndRecomputeArticleScore(
    reviewData: UpdateReviewDTO,
    articleId: string
  ): Promise<Review>;

  abstract deleteAndRecomputeArticleScore(
    reviewId: string,
    articleId: string
  ): Promise<boolean>;
}
