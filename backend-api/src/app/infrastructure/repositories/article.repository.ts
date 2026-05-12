import { Article } from '@prisma/client';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';
import { ArticleDatabaseAdapter } from '../../interface/adapter/database.adapter';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

@Injectable()
export class ArticleRepository implements ArticleDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleDTO): Promise<Article> {
    return await this.prisma.$transaction(async (tx) => {
      const articleRecord = await tx.article.create({
        data: { summary: data.summary },
      });

      await tx.articleAuthor.createMany({
        data: data.authorIds.map((userId) => ({
          articleId: articleRecord.id,
          userId,
        })),
      });

      return articleRecord;
    });
  }

  async update(data: UpdateArticleDTO): Promise<Article> {
    const article: Partial<Article> = {};
    if (data.summary !== undefined) article.summary = data.summary;
    if (data.scoreAvg !== undefined) article.scoreAvg = data.scoreAvg;

    return await this.prisma.$transaction(async (tx) => {
      const articleRecord = await tx.article.update({
        where: { id: data.id },
        data: article,
      });

      if (data.authorIds?.length) {
        await tx.articleAuthor.updateMany({
          where: { articleId: data.id, deletedOn: null },
          data: { deletedOn: new Date() },
        });

        await tx.articleAuthor.createMany({
          data: data.authorIds.map((userId) => ({
            articleId: data.id,
            userId,
          })),
        });
      }

      return articleRecord;
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
    return await this.prisma.article.findFirst({
      where: { id, deletedOn: null },
    });
  }

  async findAll(pagination?: PaginationDTO): Promise<Article[]> {
    const { skip, take } = normalizePagination(pagination);
    return await this.prisma.article.findMany({
      where: { deletedOn: null },
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
  }

  async countAll(): Promise<number> {
    return await this.prisma.article.count({ where: { deletedOn: null } });
  }

  async findByIds(ids: string[]): Promise<Article[]> {
    if (!ids.length) return [];
    return this.prisma.article.findMany({
      where: { id: { in: ids }, deletedOn: null },
      orderBy: { createdOn: 'desc' },
    });
  }

  async findMany(_id: string): Promise<Article[]> {
    throw new NotImplementedException();
  }
}
