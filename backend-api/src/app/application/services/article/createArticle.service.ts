import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { Article } from '../../../domain/models/article.model';
import { articleRowToDomain } from '../../mappers/article.mapper';
import {
  ArticleDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { ValidationException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class CreateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly userAdapter: UserDatabaseAdapter
  ) {}

  async execute(data: CreateArticleDTO): Promise<Article> {
    await this.ensureAuthorsExist(data.authorIds);

    const articleRecord = await this.adapter.create(data);

    return articleRowToDomain(articleRecord);
  }

  private async ensureAuthorsExist(authorIds: string[]): Promise<void> {
    if (!authorIds.length) return;

    const uniqueIds = [...new Set(authorIds)];
    const users = (await this.userAdapter.findByIds?.(uniqueIds)) ?? [];

    if (users.length === uniqueIds.length) return;

    const foundIds = new Set(users.map((u) => u.id));
    const missingIds = uniqueIds.filter((id) => !foundIds.has(id));

    throw new ValidationException(
      `The authors ${missingIds.join(', ')} are not registered in the system.`
    );
  }
}
