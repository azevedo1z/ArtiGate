import { Article } from '@prisma/client';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';
import { ArticleDatabaseAdapter } from '../../interface/adapter/database.adapter';

@Injectable()
export class ArticleRepository implements ArticleDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleDTO): Promise<Article> {
    const article = {
      summary: data.summary,
    };

    return await this.prisma.article.create({ data: article });
  }

  async update(data: UpdateArticleDTO): Promise<Article> {
    const article: Partial<Article> = {};
    if (data.summary !== undefined) article.summary = data.summary;
    if (data.scoreAvg !== undefined) article.scoreAvg = data.scoreAvg;

    return await this.prisma.article.update({
      where: { id: data.id },
      data: article,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.article.update({
      where: { id: id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<Article | null> {
    return await this.prisma.article.findFirst({ where: { id, deletedOn: null } });
  }

  async findAll(): Promise<Article[]> {
    return await this.prisma.article.findMany({ where: { deletedOn: null } });
  }

  async findMany(_id: string): Promise<Article[]> {
    throw new NotImplementedException();
  }
}
