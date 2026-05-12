import { ArticleAuthor } from '@prisma/client';
import { ArticleAuthorDatabaseAdapter } from '../../interface/adapter/database.adapter';
import { PrismaService } from '../services/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  ValidationException,
  NotFoundException,
} from '../../shared/exceptions/app.exception';

@Injectable()
export class ArticleAuthorRepository implements ArticleAuthorDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<ArticleAuthor>): Promise<ArticleAuthor> {
    if (!data.articleId || !data.userId) {
      throw new ValidationException(
        'Both articleId and userId are required to create an ArticleAuthor'
      );
    }
    return await this.prisma.articleAuthor.create({
      data: {
        articleId: data.articleId,
        userId: data.userId,
      },
    });
  }

  async update(data: Partial<ArticleAuthor>): Promise<ArticleAuthor> {
    if (!data.articleId || !data.userId) {
      throw new ValidationException(
        'Both articleId and userId are required to update an ArticleAuthor'
      );
    }
    const articleAuthor = await this.prisma.articleAuthor.findFirst({
      where: { userId: data.userId, articleId: data.articleId },
    });

    if (articleAuthor == null) throw new NotFoundException('ArticleAuthor not found');

    return await this.prisma.articleAuthor.update({
      where: { id: articleAuthor.id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.articleAuthor.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<ArticleAuthor | null> {
    return await this.prisma.articleAuthor.findFirst({ where: { id } });
  }

  async findAll(): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany();
  }

  async findMany(articleId: string): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany({ where: { articleId } });
  }

  async findManyByUserId(userId: string): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany({ where: { userId } });
  }
}
