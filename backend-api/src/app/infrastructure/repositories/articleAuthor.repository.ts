import { ArticleAuthor as ArticleAuthorRow } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import {
  ArticleAuthorRecord,
  ArticleAuthorRepository,
  ArticleAuthorWriteData,
} from '../../interface/repositories/articleAuthor.repository.port';
import { NotFoundException } from '../../shared/exceptions/app.exception';

const toRecord = (row: ArticleAuthorRow): ArticleAuthorRecord => ({
  id: row.id,
  articleId: row.articleId,
  userId: row.userId,
});

@Injectable()
export class PrismaArticleAuthorRepository implements ArticleAuthorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ArticleAuthorWriteData): Promise<ArticleAuthorRecord> {
    const row = await this.prisma.articleAuthor.create({ data });
    return toRecord(row);
  }

  async update(data: ArticleAuthorWriteData): Promise<ArticleAuthorRecord> {
    const articleAuthor = await this.prisma.articleAuthor.findFirst({
      where: { userId: data.userId, articleId: data.articleId },
    });

    if (articleAuthor == null)
      throw new NotFoundException('ArticleAuthor not found');

    const row = await this.prisma.articleAuthor.update({
      where: { id: articleAuthor.id },
      data,
    });
    return toRecord(row);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.articleAuthor.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<ArticleAuthorRecord | null> {
    const row = await this.prisma.articleAuthor.findFirst({ where: { id } });
    return row ? toRecord(row) : null;
  }

  async findAll(): Promise<ArticleAuthorRecord[]> {
    const rows = await this.prisma.articleAuthor.findMany();
    return rows.map(toRecord);
  }

  async findMany(articleId: string): Promise<ArticleAuthorRecord[]> {
    const rows = await this.prisma.articleAuthor.findMany({
      where: { articleId },
    });
    return rows.map(toRecord);
  }

  async findManyByUserId(userId: string): Promise<ArticleAuthorRecord[]> {
    const rows = await this.prisma.articleAuthor.findMany({
      where: { userId },
    });
    return rows.map(toRecord);
  }
}
