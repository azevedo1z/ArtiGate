import { Injectable } from '@nestjs/common';
import {
  ArticleAuthorRecord,
  ArticleAuthorRepository,
} from '../../../interface/repositories/articleAuthor.repository.port';

@Injectable()
export class GetArticleAuthorService {
  constructor(private readonly repo: ArticleAuthorRepository) {}

  async getArticleByAuthorId(authorId: string): Promise<ArticleAuthorRecord[]> {
    return this.repo.findMany(authorId);
  }

  async getByArticleId(articleId: string): Promise<ArticleAuthorRecord[]> {
    return this.repo.findMany(articleId);
  }

  async getAll(): Promise<ArticleAuthorRecord[]> {
    return this.repo.findAll();
  }
}
