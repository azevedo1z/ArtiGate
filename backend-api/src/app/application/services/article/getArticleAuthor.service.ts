import { Injectable } from '@nestjs/common';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { ArticleAuthor } from '@prisma/client';

@Injectable()
export class GetArticleAuthorService {
  constructor(private readonly adapter: DatabaseAdapter<ArticleAuthor>) {}

  async getAllAuthors(): Promise<ArticleAuthor[]> {
    const articleAuthors = await this.adapter.findAll();

    return [...articleAuthors];
  }

  async getAuthorsByArticleId(articleId: string): Promise<ArticleAuthor[]> {
    const articleAuthors = await this.adapter.findManyBy(articleId);

    return [...articleAuthors];
  }

  async getByArticleId(articleId: string): Promise<ArticleAuthor[]> {
    return await this.adapter.findManyBy(articleId);
  }
}
