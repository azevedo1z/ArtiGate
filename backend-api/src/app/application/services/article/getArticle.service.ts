import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import {
  ArticleDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';
import {
  PaginatedResult,
  PaginationDTO,
  buildPaginatedResult,
  normalizePagination,
} from '../../../shared/dtos/pagination.dto';

@Injectable()
export class GetArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter
  ) {}

  async getById(id: string): Promise<Article> {
    const existingArticle = await this.adapter.findById(id);

    if (existingArticle == null)
      throw new NotFoundException(`There is no article with the ID "${id}".`);

    return Article.factory(
      existingArticle.id,
      existingArticle.summary,
      existingArticle.scoreAvg
    );
  }

  async getAll(pagination?: PaginationDTO): Promise<PaginatedResult<Article>> {
    const { page, limit } = normalizePagination(pagination);
    const [articles, total] = await Promise.all([
      this.adapter.findAll(pagination),
      this.adapter.countAll?.() ?? Promise.resolve(0),
    ]);

    const data = articles.map((existingArticle) =>
      Article.factory(
        existingArticle.id,
        existingArticle.summary,
        existingArticle.scoreAvg
      )
    );

    return buildPaginatedResult(data, total, page, limit);
  }

  async getByAuthorId(authorId: string): Promise<Article[]> {
    const articleAuthors = await this.articleAuthorAdapter.findManyByUserId?.(
      authorId
    );

    if (!articleAuthors || articleAuthors.length === 0) return [];

    const articles = await Promise.all(
      articleAuthors.map((existingArticleAuthor) =>
        this.adapter.findById(existingArticleAuthor.articleId)
      )
    );

    return articles
      .filter(
        (article): article is NonNullable<typeof article> => article !== null
      )
      .map((article) =>
        Article.factory(article.id, article.summary, article.scoreAvg)
      );
  }
}
