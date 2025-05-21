import { Injectable } from '@nestjs/common';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { ArticleAuthor } from '@prisma/client';

@Injectable()
export class GetArticleAuthorService {
  constructor(private readonly adapter: DatabaseAdapter<ArticleAuthor>) {}

  async getArticleByAuthorId(authorId: string): Promise<ArticleAuthor[]> {
    const articleAuthors = await this.adapter.findMany(authorId);

    return [...articleAuthors];
  }

  async getByArticleId(articleId: string): Promise<ArticleAuthor[]> {
    return await this.adapter.findMany(articleId);
  }
}
