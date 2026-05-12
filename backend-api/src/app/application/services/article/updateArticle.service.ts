import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { articleRowToDomain } from '../../mappers/article.mapper';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import {
  ArticleAuthorDatabaseAdapter,
  ArticleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';
import { EnsureAuthorsExistService } from './ensureAuthorsExist.service';

@Injectable()
export class UpdateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter,
    private readonly ensureAuthorsExistService: EnsureAuthorsExistService
  ) {}

  async execute(requesterId: string, data: UpdateArticleDTO): Promise<Article> {
    const existingArticle = await this.adapter.findById(data.id);
    if (!existingArticle)
      throw new NotFoundException(`Article with ID "${data.id}" not found`);

    await this.ensureRequesterIsAuthor(data.id, requesterId);
    await this.ensureAuthorsExistService.execute(data.authorIds);

    const articleRecord = await this.adapter.update(data);

    return articleRowToDomain(articleRecord);
  }

  private async ensureRequesterIsAuthor(
    articleId: string,
    requesterId: string
  ): Promise<void> {
    const authors = await this.articleAuthorAdapter.findMany(articleId);
    if (!authors.some((a) => a.userId === requesterId))
      throw new UnauthorizedException(
        'Only authors of the article can update it.'
      );
  }
}
