import { Review } from '@prisma/client';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';

export abstract class ReviewRepository {
  abstract create(data: CreateReviewDTO): Promise<Review>;
}
