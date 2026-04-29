import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { Article } from '../../../domain/models/article.model';
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
    await this.ensureIsUser(data.authorIds);

    const articleRecord = await this.adapter.create(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }

  private async ensureIsUser(authorIds: string[]): Promise<void> {
    for (const userId of authorIds) {
      const user = await this.userAdapter.findById(userId);
      if (!user)
        throw new ValidationException(`The author "${userId}" is not registered in the system.`);
    }
  }
}
