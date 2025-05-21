import { Article } from '@prisma/client';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';
import { DatabaseAdapter } from '../../interface/adapter/database.adapter';

@Injectable()
export class ArticleRepository implements DatabaseAdapter<Article> {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleDTO): Promise<Article> {
    const article = {
      summary: data.summary,
    };

    const articleRecord = await this.prisma.article.create({ data: article });

    for (const userId of data.authorIds) {
      await this.prisma.articleAuthor.create({
        data: { articleId: articleRecord.id, userId },
      });
    }

    return articleRecord;
  }

  async update(data: UpdateArticleDTO): Promise<Article> {
    return await this.prisma.article.update({
      where: { id: data.id },
      data,
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
    return await this.prisma.article.findUnique({ where: { id } });
  }

  async findAll(): Promise<Article[]> {
    return await this.prisma.article.findMany();
  }

  async findMany(id: string): Promise<Article[]> {
    throw new NotImplementedException();
  }
}
