import { Review } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma.service';
import { ReviewRepository } from './review.repository';
import { Injectable } from '@nestjs/common';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';

@Injectable()
export class ReviewRepositoryImplementation implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDTO): Promise<Review> {
    const review = {
      articleId: data.articleId,
      reviewerId: data.reviewerId,
      score: data.score,
      commentary: data.commentary,
    };

    return this.prisma.review.create({ data: review });
  }
}
