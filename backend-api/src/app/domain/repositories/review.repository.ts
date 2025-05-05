import { Review } from '@prisma/client';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';

export abstract class ReviewRepository {
  abstract create(data: CreateReviewDTO): Promise<Review>;
  abstract findById(id: string): Promise<Review | null>;
  abstract findAll(): Promise<Review[]>;
  abstract update(data: UpdateReviewDTO): Promise<Review>;
}
