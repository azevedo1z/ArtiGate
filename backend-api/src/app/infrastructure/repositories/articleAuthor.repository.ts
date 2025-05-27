import { ArticleAuthor } from '@prisma/client';
import { ArticleAuthorDatabaseAdapter } from '../../interface/adapter/database.adapter';
import { PrismaService } from '../services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleAuthorRepository implements ArticleAuthorDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<ArticleAuthor>): Promise<ArticleAuthor> {
    if (!data.articleId || !data.userId) {
      throw new Error(
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
      throw new Error(
        'Both articleId and userId are required to create an ArticleAuthor'
      );
    }
    const articleAuthor = await this.prisma.articleAuthor.findFirst({
      where: { userId: data.userId, articleId: data.articleId },
    });

    if (articleAuthor == null) throw new Error('Not found ArticleAuthor');

    return await this.prisma.articleAuthor.update({
      where: { id: articleAuthor.id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<ArticleAuthor | null> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<ArticleAuthor[]> {
    throw new Error('Method not implemented.');
  }
  async findMany(contextParam: string): Promise<ArticleAuthor[]> {
    throw new Error('Method not implemented.');
  }
  async findManyByUserId(userId: string): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany({ where: { userId } });
  }
}
