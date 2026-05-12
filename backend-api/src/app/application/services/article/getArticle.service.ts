import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { articleRowToDomain } from '../../mappers/article.mapper';
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

    return articleRowToDomain(existingArticle);
  }

  async getAll(pagination?: PaginationDTO): Promise<PaginatedResult<Article>> {
    const { page, limit } = normalizePagination(pagination);
    const [articles, total] = await Promise.all([
      this.adapter.findAll(pagination),
      this.adapter.countAll?.() ?? Promise.resolve(0),
    ]);

    return buildPaginatedResult(
      articles.map(articleRowToDomain),
      total,
      page,
      limit
    );
  }

  async getUnreviewedAndNotAuthored(reviewerId: string): Promise<Article[]> {
    const rows =
      (await this.adapter.findUnreviewedAndNotAuthored?.(reviewerId)) ?? [];
    return rows.map(articleRowToDomain);
  }

  async getByAuthorId(authorId: string): Promise<Article[]> {
    const articleAuthors = await this.articleAuthorAdapter.findManyByUserId?.(
      authorId
    );
    if (!articleAuthors || articleAuthors.length === 0) return [];

    const articleIds = Array.from(
      new Set(articleAuthors.map((aa) => aa.articleId))
    );

    const rows = (await this.adapter.findByIds?.(articleIds)) ?? [];
    return rows.map(articleRowToDomain);
  }
}
