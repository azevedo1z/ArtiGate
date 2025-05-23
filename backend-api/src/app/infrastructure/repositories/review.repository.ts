import { Review } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';
import { ReviewDatabaseAdapter } from '../../interface/adapter/database.adapter';

@Injectable()
export class ReviewRepository implements ReviewDatabaseAdapter{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDTO): Promise<Review> {
    return await this.prisma.review.create({ data });
  }

  async update(data: UpdateReviewDTO): Promise<Review> {
    return await this.prisma.review.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.review.update({
      where: { id: id },
      data: { deletedOn: new Date() },
    });

    return true;
  }
  async findById(id: string): Promise<Review | null> {
    return await this.prisma.review.findUnique({ where: { id } });
  }

  async findAll(): Promise<Review[]> {
    return await this.prisma.review.findMany();
  }

  async findMany(contextParam: string): Promise<Review[]> {
    throw new NotImplementedException();
  }

  async findManyByUserId(reviewerId: string): Promise<Review[]> {
    return await this.prisma.review.findMany({ where: { reviewerId } });
  }
}
