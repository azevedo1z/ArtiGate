import { Injectable } from '@nestjs/common';
import { ArticleAuthorDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { ArticleAuthor } from '@prisma/client';

@Injectable()
export class GetArticleAuthorService {
  constructor(private readonly adapter: ArticleAuthorDatabaseAdapter) {}

  async getArticleByAuthorId(authorId: string): Promise<ArticleAuthor[]> {
    const articleAuthors = await this.adapter.findMany(authorId);

    return articleAuthors;
  }

  async getByArticleId(articleId: string): Promise<ArticleAuthor[]> {
    return await this.adapter.findMany(articleId);
  }

  async getAll(): Promise<ArticleAuthor[]> {
    return await this.adapter.findAll();
  }
}
