import { Review as ReviewRow } from '@prisma/client';
import { Review } from '../../domain/models/review.model';

export const reviewRowToDomain = (row: ReviewRow): Review =>
  Review.factory({
    id: row.id,
    articleId: row.articleId,
    reviewerId: row.reviewerId,
    score: row.score,
    commentary: row.commentary,
  });
