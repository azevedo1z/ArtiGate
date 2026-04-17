import { Review } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';
import { ReviewDatabaseAdapter } from '../../interface/adapter/database.adapter';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

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
    return await this.prisma.review.findFirst({ where: { id, deletedOn: null } });
  }

  async findAll(pagination?: PaginationDTO): Promise<Review[]> {
    const { skip, take } = normalizePagination(pagination);
    return await this.prisma.review.findMany({
      where: { deletedOn: null },
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
  }

  async countAll(): Promise<number> {
    return await this.prisma.review.count({ where: { deletedOn: null } });
  }

  async findMany(articleId: string): Promise<Review[]> {
    return await this.prisma.review.findMany({ where: { articleId, deletedOn: null } });
  }

  async findManyByUserId(reviewerId: string): Promise<Review[]> {
    return await this.prisma.review.findMany({ where: { reviewerId, deletedOn: null } });
  }
}
