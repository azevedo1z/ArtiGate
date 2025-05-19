import { BadRequestException, Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { ArticleAuthor } from '@prisma/client';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class GetArticleService {
  constructor(
    private readonly adapter: DatabaseAdapter<Article>,
    private readonly articleAuthorAdapter: DatabaseAdapter<ArticleAuthor>
  ) {}

  async getById(id: string): Promise<Article | null> {
    const existingArticle = await this.adapter.findBy(id);

    if (existingArticle == null)
      throw new BadRequestException(`There is no article with the ID "${id}".`);

    return Article.factory(
      existingArticle.id,
      existingArticle.summary,
      existingArticle.scoreAvg
    );
  }

  async getAll(): Promise<Article[]> {
    const articles = await this.adapter.findAll();

    return articles.map((existingArticle) =>
      Article.factory(
        existingArticle.id,
        existingArticle.summary,
        existingArticle.scoreAvg
      )
    );
  }

  async getAllAuthors(): Promise<ArticleAuthor[]> {
    const articleAuthors = await this.articleAuthorAdapter.findAll();

    return [...articleAuthors];
  }

  async getAuthorsByArticleId(articleId: string): Promise<ArticleAuthor[]> {
    const articleAuthors = await this.articleAuthorAdapter.findManyBy(articleId);

    return [...articleAuthors];
  }
}
