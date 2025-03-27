import { Article } from '@prisma/client';
import { CreateArticleDTO } from '../../applications/dtos/article/createArticle.dto';
import { ArticleRepository } from './article.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma.service';

@Injectable()
export class ArticleRepositoryImplementation implements ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleDTO): Promise<Article> {
    const article = {
      summary: data.summary,
      authorIds: data.authorIds,
    };

    return this.prisma.article.create({ data: article });
  }

  async findById(id: string): Promise<Article | null> {
    return this.prisma.article.findUnique({ where: { id } });
  }

  async findAll(): Promise<Array<Article>> {
    return this.prisma.article.findMany();
  }
}
