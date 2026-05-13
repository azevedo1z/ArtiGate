import { Article as ArticleRow } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Article } from '../../domain/models/article.model';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';
import { ArticleRepository } from '../../interface/repositories/article.repository.port';
import { PrismaService } from '../services/prisma.service';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

const rowToDomain = (row: ArticleRow): Article =>
  Article.factory({
    id: row.id,
    summary: row.summary,
    scoreAvg: row.scoreAvg,
  });

@Injectable()
export class PrismaArticleRepository implements ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleDTO): Promise<Article> {
    const row = await this.prisma.$transaction(async (tx) => {
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
    return rowToDomain(row);
  }

  async update(data: UpdateArticleDTO): Promise<Article> {
    const articlePatch: Partial<ArticleRow> = {};
    if (data.summary !== undefined) articlePatch.summary = data.summary;
    if (data.scoreAvg !== undefined) articlePatch.scoreAvg = data.scoreAvg;

    const row = await this.prisma.$transaction(async (tx) => {
      const articleRecord = await tx.article.update({
        where: { id: data.id },
        data: articlePatch,
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
    return rowToDomain(row);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.article.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<Article | null> {
    const row = await this.prisma.article.findFirst({ where: { id } });
    return row ? rowToDomain(row) : null;
  }

  async findAll(pagination?: PaginationDTO): Promise<Article[]> {
    const { skip, take } = normalizePagination(pagination);
    const rows = await this.prisma.article.findMany({
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
    return rows.map(rowToDomain);
  }

  async countAll(): Promise<number> {
    return this.prisma.article.count();
  }

  async findByIds(ids: string[]): Promise<Article[]> {
    if (!ids.length) return [];
    const rows = await this.prisma.article.findMany({
      where: { id: { in: ids } },
      orderBy: { createdOn: 'desc' },
    });
    return rows.map(rowToDomain);
  }

  async findReviewableByUser(userId: string): Promise<Article[]> {
    const rows = await this.prisma.article.findMany({
      where: {
        authors: { none: { userId } },
        reviews: { none: { reviewerId: userId } },
      },
      orderBy: { createdOn: 'desc' },
    });
    return rows.map(rowToDomain);
  }
}
