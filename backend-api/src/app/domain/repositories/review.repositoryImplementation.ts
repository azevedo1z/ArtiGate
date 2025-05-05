import { Review } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma.service';
import { ReviewRepository } from './review.repository';
import { Injectable } from '@nestjs/common';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';

@Injectable()
export class ReviewRepositoryImplementation implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDTO): Promise<Review> {
    return await this.prisma.review.create({ data });
  }

  async findById(id: string): Promise<Review | null> {
    return await this.prisma.review.findUnique({ where: { id } });
  }

  async findAll(): Promise<Review[]> {
    return await this.prisma.review.findMany();
  }

  async update(data: UpdateReviewDTO): Promise<Review> {
    //TODO: Globalize this
    const dataToUpdate = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    return await this.prisma.review.update({
      where: { id: data.id },
      data: dataToUpdate,
    });
  }
}
