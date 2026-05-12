import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { articleRowToDomain } from '../../mappers/article.mapper';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import {
  ArticleAuthorDatabaseAdapter,
  ArticleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';
import { EnsureAuthorsExistService } from './ensureAuthorsExist.service';

@Injectable()
export class UpdateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter,
    private readonly ensureAuthorsExistService: EnsureAuthorsExistService
  ) {}

  async execute(requesterId: string, data: UpdateArticleDTO): Promise<Article> {
    const existing = await this.adapter.findById(data.id);
    if (!existing)
      throw new NotFoundException(`Article with ID "${data.id}" not found`);

    const authors = await this.articleAuthorAdapter.findMany(data.id);
    Article.assertAuthoredBy(
      authors.map((a) => a.userId),
      requesterId
    );

    if (data.authorIds !== undefined) {
      Article.assertAuthorCount(data.authorIds);
      await this.ensureAuthorsExistService.execute(data.authorIds);
    }

    Article.ensureInvariants({
      id: existing.id,
      summary: data.summary ?? existing.summary,
      scoreAvg: data.scoreAvg ?? existing.scoreAvg,
    });

    const articleRecord = await this.adapter.update(data);

    return articleRowToDomain(articleRecord);
  }
}
