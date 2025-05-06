import { Article, ArticleAuthor } from '@prisma/client';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { ArticleRepository } from './article.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma.service';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';

@Injectable()
export class ArticleRepositoryImplementation implements ArticleRepository {
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

  async findById(id: string): Promise<Article | null> {
    return await this.prisma.article.findUnique({ where: { id } });
  }

  async findAll(): Promise<Article[]> {
    return await this.prisma.article.findMany();
  }

  async findAllAuthors(): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany();
  }

  async findAuthorsByArticleId(articleId: string): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany({ where: { articleId } });
  }

  async update(data: UpdateArticleDTO): Promise<Article> {
    //TODO: Globalize this
    const dataToUpdate = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    return await this.prisma.article.update({
      where: { id: data.id },
      data: dataToUpdate,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.article.update({
      where: { id: id },
      data: { deletedOn: new Date() },
    });
    return true;
  }
}
