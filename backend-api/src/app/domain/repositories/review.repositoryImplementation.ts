import { Review } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma.service';
import { ReviewRepository } from './review.repository';
import { Injectable } from '@nestjs/common';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';

@Injectable()
export class ReviewRepositoryImplementation implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDTO): Promise<Review> {
    return this.prisma.review.create({ data });
  }

  async findById(id: string): Promise<Review | null> {
    return this.prisma.review.findUnique({ where: { id } });
  }

  async findAll(): Promise<Review[]> {
    return this.prisma.review.findMany();
  }
}
