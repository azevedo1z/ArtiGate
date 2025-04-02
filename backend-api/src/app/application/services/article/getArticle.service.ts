import { Injectable } from '@nestjs/common';
import { ArticleRepository } from '../../../domain/repositories/article.repository';
import { Article } from '../../../domain/models/article.model';
import { ArticleAuthor } from '@prisma/client';

@Injectable()
export class GetArticleService {
  constructor(private readonly repository: ArticleRepository) {}

  async getById(id: string): Promise<Article | null> {
    const existingArticle = await this.repository.findById(id);

    if (existingArticle == null)
      throw new Error(`There is no article with the ID "${id}".`);

    return Article.factory(
      existingArticle.id,
      existingArticle.summary,
      existingArticle.scoreAvg
    );
  }

  async getAll(): Promise<Article[]> {
    const articles = await this.repository.findAll();

    return articles.map((existingArticle) =>
      Article.factory(
        existingArticle.id,
        existingArticle.summary,
        existingArticle.scoreAvg
      )
    );
  }

  async getAllAuthors(): Promise<ArticleAuthor[]> {
    const articleAuthors = await this.repository.findAllAuthors();

    return [...articleAuthors];
  }

  async getByAuthorId(articleId: string): Promise<ArticleAuthor[]> {
    const existingArticleAuthor = await this.repository.findAuthorsByArticleId(
      articleId
    );

    return [...existingArticleAuthor];
  }
}
