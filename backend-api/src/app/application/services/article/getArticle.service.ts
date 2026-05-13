import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { ArticleRepository } from '../../../interface/repositories/article.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
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
    private readonly repo: ArticleRepository,
    private readonly articleAuthorRepo: ArticleAuthorRepository
  ) {}

  async getById(id: string): Promise<Article> {
    const existing = await this.repo.findById(id);

    if (existing == null)
      throw new NotFoundException(`There is no article with the ID "${id}".`);

    return existing;
  }

  async getAll(pagination?: PaginationDTO): Promise<PaginatedResult<Article>> {
    const { page, limit } = normalizePagination(pagination);
    const [articles, total] = await Promise.all([
      this.repo.findAll(pagination),
      this.repo.countAll(),
    ]);

    return buildPaginatedResult(articles, total, page, limit);
  }

  async getReviewableByUser(userId: string): Promise<Article[]> {
    return this.repo.findReviewableByUser(userId);
  }

  async getByAuthorId(authorId: string): Promise<Article[]> {
    const articleAuthors = await this.articleAuthorRepo.findManyByUserId(
      authorId
    );
    if (!articleAuthors.length) return [];

    const articleIds = Array.from(
      new Set(articleAuthors.map((aa) => aa.articleId))
    );

    return this.repo.findByIds(articleIds);
  }
}
