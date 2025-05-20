import { Review } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';
import { DatabaseAdapter } from '../../interface/adapter/database.adapter';

@Injectable()
export class ReviewRepository implements DatabaseAdapter<Review> {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDTO): Promise<Review> {
    return await this.prisma.review.create({ data });
  }

  async findBy(id: string): Promise<Review | null> {
    return await this.prisma.review.findUnique({ where: { id } });
  }

  async findAll(): Promise<Review[]> {
    return await this.prisma.review.findMany();
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

  async findManyBy(contextParam: string): Promise<Review[]> {
    throw new NotImplementedException();
  }

  // async findManyBy(reviewerId: string): Promise<Review[]> {
  //   return await this.prisma.review.findMany({
  //     where: { reviewerId: reviewerId },
  //   });
  // }

  // async findManyBy(articleId: string): Promise<Review[]> {
  //   return await this.prisma.review.findMany({
  //     where: { articleId: articleId },
  //   });
  // }
}
